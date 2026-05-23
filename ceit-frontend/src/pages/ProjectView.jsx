import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';

export default function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // 1. ดึงข้อมูลโปรเจกต์
  useEffect(() => {
    axios.get(`http://localhost:5000/api/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // 2. ดึงคอมเมนต์ของโปรเจกต์นี้
  useEffect(() => {
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/projects/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  // 3. ฟังก์ชันส่งคอมเมนต์ใหม่ไปยัง Backend
  const handlePostComment = async () => {
    if (!newMessage.trim()) return; 
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/projects/${id}/comments`, 
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setNewMessage(''); // ล้างช่องพิมพ์เมื่อส่งสำเร็จ
      fetchComments();   // ดึงข้อมูลคอมเมนต์ใหม่มาโชว์ทันที
    } catch (err) {
      alert('กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็นครับ');
    }
  };

  if (!project) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      {/* ส่วนหัวหน้าเว็บพร้อมปุ่มย้อนกลับ */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[26px] font-bold text-gray-900">{project.title}</h1>
      </div>
      
      {/* กรอบแสดง PDF */}
      <div className="w-full bg-[#323639] rounded-xl overflow-hidden shadow-lg mb-8" style={{ height: '80vh' }}>
        {project.pdf_url ? (
          <iframe 
            src={`http://localhost:5000/uploads/${project.pdf_url}`} 
            className="w-full h-full"
            title="PDF Viewer"
          ></iframe>
        ) : (
          <div className="text-white p-10 flex items-center justify-center h-full">ไม่พบไฟล์ PDF สำหรับโปรเจกต์นี้</div>
        )}
      </div>

      {/* --- 4. ส่วนกล่อง Comments (แสดงผลแบบเรียลไทม์พร้อมวันที่และเวลา) --- */}
      <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100">
        <h3 className="text-[20px] font-bold mb-6 text-gray-800">Comments</h3>
        
        {/* รายการคอมเมนต์จาก Users */}
        <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
          {comments.length > 0 ? (
            comments.map(c => (
              <div key={c.id} className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  {/* แสดงรหัสนักศึกษา */}
                  <p className="text-[14px] font-bold text-blue-600">{c.student_id}</p>
                  
                  {/* แสดงวันที่และเวลา (รูปแบบ: วัน/เดือน/ปี ชั่วโมง:นาที) */}
                  <p className="text-[12px] text-gray-400">
            {new Date(c.created_at).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </p>
                </div>
                {/* ข้อความคอมเมนต์ */}
                <p className="text-gray-700 text-[15px]">{c.message}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4 text-[15px]">ยังไม่มีการแสดงความคิดเห็น</p>
          )}
        </div>

        {/* ช่องพิมพ์ข้อความคอมเมนต์ */}
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="comment..."
          className="w-full h-[120px] p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all resize-none mb-4 text-[15px]"
        />
        
        {/* ปุ่มกด Post สำหรับบันทึกข้อมูล */}
        <button 
          onClick={handlePostComment}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-[16px]"
        >
          Post
        </button>
      </div>
    </div>
  );
}