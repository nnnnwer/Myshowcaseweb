import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert } from 'lucide-react'; // 🌟 Import ShieldAlert สำหรับแสดงหน้าต่างเตือนภัยระบบสิทธิ์

export default function Upload() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // 🌟 ดึงสิทธิ์ของผู้ใช้เพื่อมาเช็คระดับความปลอดภัย

  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '', // จะเก็บค่าตัวพิมพ์เล็กส่งไปหลังบ้าน
    advisor: '',
    project_year: '',
    major: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('ກະລຸນາເລືອກໄຟລ໌ PDF ກ່ອນ!');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('advisor', formData.advisor);
    data.append('project_year', formData.project_year);
    data.append('major', formData.major);
    data.append('pdf', file); 

    try {
      await axios.post('http://localhost:5000/api/projects', data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      alert('ອັບໂຫລດຫົວບົດສຳເລັດ!');
      navigate('/'); 
    } catch (error) {
      alert('ເກີດຂໍ້ຜິດພາດ: ' + (error.response?.data?.error || error.message));
    }
  };

  // 🌟 [ระบบความปลอดภัยหน้าบ้าน] บล็อกไม่ให้อาจารย์และคนทั่วไปเห็นฟอร์มหรืออัปโหลดข้อมูลได้เด็ดขาด
  if (!token || role !== 'student') {
    return (
      <div className="max-w-[550px] mx-auto mt-20 p-10 text-center bg-white rounded-3xl border border-gray-100 shadow-sm font-sans">
        <ShieldAlert className="mx-auto text-amber-500 mb-4" size={56} />
        <h3 className="text-[22px] font-bold text-gray-900 mb-2">ຂໍອະໄພ ສິດທິຂອງທ່ານບໍ່ສາມາດອັບໂຫຼດໄດ້</h3>
        <p className="text-gray-500 text-[15px] mb-6">
          ລະບົບນີ້ອະນຸຍາດໃຫ້ສະເພາະ "ນັກສຶກສາ CEIT" ເທົ່ານັ້ນທີ່ມີສິດອັບໂຫຼດເລັ້ມບົດວິໄຈຂຶ້ນລະບົບ.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
        >
          ກັບຄືນໜ້າຫຼັກ
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full min-h-screen bg-[#F8FAFC] py-10 font-sans">
      <div className="bg-white p-10 w-full max-w-[700px] rounded-[32px] shadow-sm border border-gray-100 h-fit">
        <h2 className="text-[26px] font-bold text-gray-900 mb-6">ອັບໂຫລດຫົວບົດຈົບຊັ້ນ</h2>
        
        <form onSubmit={handleUpload} className="space-y-6">
          {/* ชื่องานวิจัย */}
          <div>
            <label className="block text-[14px] font-bold mb-2 text-gray-700">ຊື່ຫົວບົດ</label>
            <input type="text" name="title" onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" placeholder="ຊື່ຫົວບົດ" />
          </div>

          {/* หมวดหมู่โครงงาน */}
          <div>
            <label className="block text-[14px] font-bold mb-2 text-gray-700">ໝວດໝູ່</label>
            {/* 🌟 ปรับปรุงแก้ไข: เปลี่ยนเป็นตัวพิมพ์เล็กทั้งหมด พร้อมเพิ่มตัวเลือก iot เรียบร้อยครับ */}
            <select name="category" onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 cursor-pointer bg-white transition-colors">
              <option value="">ເລືອກໝວດໝູ່</option>
              <option value="animation">Animation</option>
              <option value="database">Database</option>
              <option value="network">Network</option>
              <option value="iot">IoT / Embedded System</option>
            </select>
          </div>

          {/* อาจารย์ที่ปรึกษา */}
          <div>
            <label className="block text-[14px] font-bold mb-2 text-gray-700">ອາຈານທີ່ປຶກສາ</label>
            <input type="text" name="advisor" onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" placeholder="Enter advisor name" />
          </div>

          {/* ปีการศึกษา และ สาขาวิชา */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] font-bold mb-2 text-gray-700">ສົກສຶກສາ</label>
              <input type="text" name="project_year" onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" placeholder="2025-2026" />
            </div>
            <div>
              <label className="block text-[14px] font-bold mb-2 text-gray-700">ສາຂາ</label>
              {/* 🌟 ปรับปรุงแก้ไข: เปลี่ยนค่า value ตัวเลือกสาขาให้สั้นกระชับตรงตาม Logic ฝั่งหลังบ้าน (CE / IT) */}
              <select name="major" onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 cursor-pointer bg-white transition-colors">
                <option value="">ເລືອກສາຂາ</option>
                <option value="CE">ວິສະວະກຳຄອມພິວເຕີ (CE)</option>
                <option value="IT">ເຕັກໂນໂລຊີຂໍ້ມູນຂ່າວສານ (IT)</option>
              </select>
            </div>
          </div>

          {/* อัปโหลดเล่มไฟล์ PDF */}
          <div>
            <label className="block text-[14px] font-bold mb-2 text-gray-700">PDF File</label>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={(e) => setFile(e.target.files[0])} 
              required
              className="w-full border border-dashed border-gray-300 rounded-xl p-5 bg-gray-50 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-bold text-sm" 
            />
          </div>

          {/* ปุ่มยกเลิก / ปุ่มส่งข้อมูล */}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => navigate('/')} className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-colors">ຍົກເລີກ</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-sm">ອັບໂຫລດຫົວບົດ</button>
          </div>
        </form>
      </div>
    </div>
  );
}