import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- นำเข้า axios สำหรับเรียก API

export default function Register() {
  const [studentId, setStudentId] = useState('');
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // <-- ใช้สำหรับเปลี่ยนหน้าอัตโนมัติ

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      // ส่งข้อมูลไปที่ Backend ของเรา (พอร์ต 5000)
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        student_id: studentId,
        tel: tel,
        password: password
      });

      // ถ้าสำเร็จ แจ้งเตือนและเด้งไปหน้า Login
      alert('สมัครสมาชิกสำเร็จ!');
      navigate('/login');
      
    } catch (error) {
      // ถ้า Error (เช่น รหัสนักศึกษานี้มีในระบบแล้ว)
      const errorMsg = error.response?.data?.error || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";
      alert("สมัครไม่สำเร็จ: " + errorMsg);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-12 w-full">
      <div className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 w-full max-w-[440px]">
        <h2 className="text-[22px] font-bold text-gray-900 mb-1">Create Account</h2>
        <p className="text-[15px] text-gray-500 mb-8">Join CEIT Research Showcase</p>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-[14px] font-bold text-gray-900 mb-2">Student ID</label>
            <input 
              type="text" 
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[15px] focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
              placeholder="Enter student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[14px] font-bold text-gray-900 mb-2">Tel</label>
            <input 
              type="tel" 
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[15px] focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
              placeholder="Enter telephone number"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[14px] font-bold text-gray-900 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[15px] focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#2563EB] text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-[15px] mt-2"
          >
            Register
          </button>
        </form>
        
        <div className="mt-6 text-[14px] text-gray-500">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login here</Link>
        </div>
      </div>
    </div>
  );
}