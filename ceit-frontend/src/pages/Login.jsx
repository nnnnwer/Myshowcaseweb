import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

export default function Login() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // 🌟 กลับมาใช้ localhost พอร์ต 5000 บนเครื่องตัวเอง 🌟
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        student_id: studentId,
        password: password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('student_id', response.data.student_id);
      
      alert('เข้าสู่ระบบสำเร็จ!');
      navigate('/'); 
      window.location.reload(); 
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";
      alert("เข้าสู่ระบบไม่สำเร็จ: " + errorMsg);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-12 w-full">
      <div className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 w-full max-w-[440px]">
        <h2 className="text-[22px] font-bold text-gray-900 mb-1">Welcome to CEIT</h2>
        <p className="text-[15px] text-gray-500 mb-8">Login to continue</p>
        
        <form onSubmit={handleLogin} className="space-y-5">
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
            Login
          </button>
        </form>
        
        <div className="mt-6 text-[14px] text-gray-500">
          Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
}