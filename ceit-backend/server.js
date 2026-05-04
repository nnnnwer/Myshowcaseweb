const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// --- 1. Middleware (ต้องอยู่ด้านบนสุด) ---
app.use(cors());
app.use(express.json());
// ทำให้โฟลเดอร์ uploads เข้าถึงได้ผ่าน URL เพื่อเปิดดูไฟล์ PDF
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 2. Database Connection ---
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'ceit_showcase',
    charset: 'utf8mb4'
});

// --- 3. Multer Configuration (ระบบจัดการไฟล์อัปโหลด) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // เก็บไฟล์ไว้ในโฟลเดอร์ uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- 4. Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// --- 5. Routes ---

// ดึงข้อมูลโปรเจกต์ทั้งหมด (พร้อมคำนวณค่าเฉลี่ยดาว)
app.get('/api/projects', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, 
            IFNULL(AVG(r.rating), 0) as avg_rating, 
            COUNT(r.id) as rating_count
            FROM projects p
            LEFT JOIN ratings r ON p.id = r.project_id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ดึงข้อมูลโปรเจกต์รายตัว (สำหรับหน้า View)
app.get('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Project not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// อัปโหลดโปรเจกต์ใหม่พร้อมไฟล์ PDF
app.post('/api/projects', authenticateToken, upload.single('pdf'), async (req, res) => {
    const { title, description, category, advisor, project_year, major } = req.body;
    const userId = req.user.id;
    const pdfPath = req.file ? req.file.filename : null; 

    try {
        await pool.query(
            'INSERT INTO projects (title, description, category, advisor, project_year, major, views, user_id, pdf_url) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)', 
            [title, description, category, advisor, project_year, major, userId, pdfPath]
        );
        res.status(201).json({ message: 'Project uploaded successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// บันทึกคะแนน Rating (ดาว)
app.post('/api/projects/:id/rate', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;
    try {
        await pool.query(
            'INSERT INTO ratings (project_id, user_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?',
            [id, userId, rating, rating]
        );
        res.json({ message: 'Rating saved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ลบโปรเจกต์ (เช็คสิทธิ์เจ้าของ)
app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const [project] = await pool.query('SELECT user_id FROM projects WHERE id = ?', [id]);
        if (project.length === 0) return res.status(404).json({ error: 'Project not found' });
        if (project[0].user_id !== userId) return res.status(403).json({ error: 'Unauthorized' });

        await pool.query('DELETE FROM projects WHERE id = ?', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Auth: Login & Register (คงเดิม)
app.post('/api/auth/register', async (req, res) => {
    const { student_id, tel, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (student_id, tel, password) VALUES (?, ?, ?)', [student_id, tel, hashedPassword]);
        res.status(201).json({ message: 'User registered' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
    const { student_id, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE student_id = ?', [student_id]);
        if (users.length === 0) return res.status(400).json({ error: 'User not found' });
        const validPassword = await bcrypt.compare(password, users[0].password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });
        const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, student_id: users[0].student_id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


// ดึงคอมเมนต์ของโปรเจกต์นั้นๆ (แสดงชื่อคนคอมเมนต์ด้วย)
app.get('/api/projects/:id/comments', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT c.*, u.student_id 
            FROM comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.project_id = ? 
            ORDER BY c.created_at ASC
        `, [id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// บันทึกคอมเมนต์ใหม่
app.post('/api/projects/:id/comments', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.id;
    try {
        await pool.query('INSERT INTO comments (project_id, user_id, message) VALUES (?, ?, ?)', [id, userId, message]);
        res.status(201).json({ message: 'Comment posted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));