import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

export default function Register() {
  // 🌟 เพิ่ม State สำหรับเก็บสิทธิ์ (role) และชื่อเต็ม (name)
  const [role, setRole] = useState('student'); // ค่าเริ่มต้นเป็นนักศึกษา
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      // 🌟 ส่งข้อมูลข้ามสายพานไปยังหลังบ้านตามเงื่อนไขที่เลือกแบบ Dynamic
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        role,
        student_id: role === 'student' ? studentId : null,
        name: role === 'student' ? null : name,
        tel: tel,
        password: password
      });

      alert('ສ້າງບັນຊີສຳເລັດ!');
      navigate('/login');
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || "ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ກັບເຊີບເວີ້";
      alert("ລົງທະບຽນບໍ່ສຳເລັດ: " + errorMsg);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-12 w-full font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 w-full max-w-[440px]">
        <h2 className="text-[35px] font-bold text-gray-900 mb-1">ສ້າງບັນຊີໃນ CEIT Showcase</h2>
        <p className="text-[15px] text-gray-500 mb-6">ເຂົ້າຮ່ວມກັບ CEIT Showcase</p>
        
        {/* 🌟 แถบปุ่มสลับประเภทผู้ใช้งาน สไตล์ฟ้า-ขาว คุมโทนมินิมอล */}
        <div className="flex bg-gray-50 p-1 rounded-xl mb-6 border border-gray-200">
          <button 
            type="button" 
            onClick={() => { setRole('student'); setName(''); }} 
            className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${role === 'student' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ນັກສຶກສາ CEIT
          </button>
          <button 
            type="button" 
            onClick={() => { setRole('teacher'); setStudentId(''); }} 
            className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${role === 'teacher' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ອາຈານ
          </button>
          <button 
            type="button" 
            onClick={() => { setRole('general'); setStudentId(''); }} 
            className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${role === 'general' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ຄົນທົ່ວໄປ
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* 🌟 เงื่อนไขสลับฟิลด์ข้อมูลการกรอกแบบ Dynamic */}
          {role === 'student' ? (
            <div>
              <label className="block text-[14px] font-bold text-gray-900 mb-2">ລະຫັດນັກສຶກສາ</label>
              <input 
                type="text" 
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[15px] focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                placeholder="Enter student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-[14px] font-bold text-gray-900 mb-2">
                {role === 'teacher' ? 'ຊື່ອາຈານ' : 'ຊື່ ແລະ ນາມສະກຸນ'}
              </label>
              <input 
                type="text" 
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[15px] focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                placeholder={role === 'teacher' ? "Enter teacher name" : "Enter full name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-[14px] font-bold text-gray-900 mb-2">ເບີໂທລະສັບ</label>
            <input 
              type="tel" 
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[15px] focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
              placeholder="+856 20X XXX XXX"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
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
            ສ້າງບັນຊີ
          </button>
        </form>
        
        <div className="mt-6 text-[14px] text-gray-500">
          ມີບັນຊີແລ້ວ? <Link to="/login" className="text-blue-600 font-bold hover:underline">ເຂົ້າສູ່ລະບົບທີ່ນີ້</Link>
        </div>
      </div>
    </div>
  );
}