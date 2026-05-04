import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    advisor: '',
    project_year: '',
    major: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('กรุณาเลือกไฟล์ PDF ก่อนครับ');

    // ใช้ FormData เพื่อส่งไฟล์ PDF ไปยังเซิร์ฟเวอร์
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('advisor', formData.advisor);
    data.append('project_year', formData.project_year);
    data.append('major', formData.major);
    data.append('pdf', file); // 'pdf' ต้องชื่อเดียวกับใน multer upload.single('pdf')

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/projects', data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      alert('อัปโหลดไฟล์และข้อมูลสำเร็จ!');
      navigate('/'); 
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-[#F8FAFC] py-10">
      <div className="bg-white p-10 w-full max-w-[700px] rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-[26px] font-bold text-gray-900 mb-6">Upload Your Research Project</h2>
        
        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-[14px] font-bold mb-2">Project Title</label>
            <input type="text" name="title" onChange={handleChange} required className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500" placeholder="Project Title" />
          </div>

          <div>
            <label className="block text-[14px] font-bold mb-2">Category</label>
            <select name="category" onChange={handleChange} required className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500">
              <option value="">Select Category</option>
              <option value="Animation">Animation</option>
              <option value="Database">Database</option>
              <option value="Network">Network</option>
            </select>
          </div>

          <div>
            <label className="block text-[14px] font-bold mb-2">Advisor</label>
            <input type="text" name="advisor" onChange={handleChange} required className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500" placeholder="Enter advisor name" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] font-bold mb-2">Year</label>
              <input type="text" name="project_year" onChange={handleChange} required className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500" placeholder="2021-2022" />
            </div>
            <div>
              <label className="block text-[14px] font-bold mb-2">Major</label>
              <select name="major" onChange={handleChange} required className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500">
                <option value="">Select Major</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="IT">IT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-bold mb-2">PDF File</label>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={(e) => setFile(e.target.files[0])} 
              required
              className="w-full border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 cursor-pointer" 
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button type="button" onClick={() => navigate('/')} className="flex-1 py-3 rounded-lg border font-bold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700">Upload Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}