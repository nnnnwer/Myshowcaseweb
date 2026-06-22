import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

export default function Login() {
  const [role, setRole] = useState('student'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: username,
        password: password
      });

      if (response.data.role !== role) {
        alert(`ບັນຊີນີ້ບໍ່ແມ່ນສິດຂອງ ${role === 'student' ? 'ນັກສຶກສາ' : role === 'teacher' ? 'ອາຈານ' : 'ຄົນທົ່ວໄປ'} ກະລຸນາເລືອກປະເພດໃຫ້ຖືກຕ້ອງ!`);
        return;
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      
      if (response.data.role === 'student') {
        localStorage.setItem('student_id', response.data.student_id);
      } else {
        localStorage.setItem('student_id', response.data.name);
      }
      
      alert('ເຂົ້າສູ່ລະບົບສຳເລັດ!');
      navigate('/'); 
      window.location.reload(); 
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || "ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ກັບເຊີບເວີ້";
      alert("ເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ: " + errorMsg);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-12 w-full font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 w-full max-w-[440px]">
        <h2 className="text-[35px] font-bold text-gray-900 mb-1">ເຂົ້າສູ່ CEIT Showcase</h2>
        <p className="text-[15px] text-gray-500 mb-8">ກົດປຸ່ມເຂົ້າສູ່ລະບົບເພື່ອດຳເນີນການຕໍ່</p>
        
        {/* แถบปุ่มจำแนกสิทธิ์ */}
        <div className="flex bg-gray-50 p-1 rounded-xl mb-6 border border-gray-200">
          <button 
            type="button" 
            onClick={() => { setRole('student'); setUsername(''); }} 
            className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${role === 'student' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ນັກສຶກສາ
          </button>
          <button 
            type="button" 
            onClick={() => { setRole('teacher'); setUsername(''); }} 
            className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${role === 'teacher' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ອາຈານ
          </button>
          <button 
            type="button" 
            onClick={() => { setRole('general'); setUsername(''); }} 
            className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${role === 'general' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ຄົນທົ່ວໄປ
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            {/* 🌟 3. แก้ไขจุดนี้: เปลี่ยนชื่อป้าย Label และคำบอกใบ้ตัวอย่างให้กรอกเป็น "ชื่อ" ตามประเภทสิทธิ์ที่กดเลือก */}
            <label className="block text-[14px] font-bold text-gray-900 mb-2">
              {role === 'student' ? 'ລະຫັດນັກສຶກສາ' : role === 'teacher' ? 'ຊື່ອາຈານ' : 'ຊື່ ແລະ ນາມສະກຸນ'}
            </label>
            <input 
              type="text" 
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[15px] focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
              placeholder={role === 'student' ? "Enter student ID" : role === 'teacher' ? "Enter teacher name" : "Enter full name"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[14px] font-bold text-gray-900 mb-2">ລະຫັດຜ່ານ</label>
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
            ເຂົ້າສູ່ລະບົບ
          </button>
        </form>
        
        <div className="mt-6 text-[14px] text-gray-500">
          ຍັງບໍ່ມີບັນຊີ? <Link to="/register" className="text-blue-600 font-bold hover:underline">ລົງທະບຽນບ່ອນນີ້</Link>
        </div>
      </div>
    </div>
  );
}