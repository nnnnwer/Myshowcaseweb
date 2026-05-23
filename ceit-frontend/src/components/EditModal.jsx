import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

export default function EditModal({ isOpen, onClose, projectId, onUpdateSuccess }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Animation');
  const [advisor, setAdvisor] = useState('');
  const [projectYear, setProjectYear] = useState(''); 
  const [major, setMajor] = useState('Computer Engineering'); 
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ดึงข้อมูลเดิมมาใส่ในฟอร์ม (โดยไม่มีการดึง description)
  useEffect(() => {
    if (isOpen && projectId) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/projects/${projectId}`)
        .then(res => {
          setTitle(res.data.title);
          setCategory(res.data.category || 'Animation');
          setAdvisor(res.data.advisor);
          setProjectYear(res.data.project_year || ''); 
          setMajor(res.data.major || 'Computer Engineering'); 
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          alert('ไม่สามารถโหลดข้อมูลโปรเจกต์ได้');
          onClose();
        });
    }
  }, [isOpen, projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('advisor', advisor);
    formData.append('project_year', projectYear); 
    formData.append('major', major);             
    if (pdfFile) {
      formData.append('pdf', pdfFile);
    }

    try {
      await axios.put(`http://localhost:5000/api/projects/${projectId}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('แก้ไขข้อมูลสำเร็จเรียบร้อย!');
      onUpdateSuccess(); 
      onClose();         
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.error || error.message));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-[650px] rounded-[32px] p-8 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* ปุ่มกากบาทปิด */}
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50">
          <X size={20} />
        </button>

        <h2 className="text-[22px] font-bold text-gray-900 mb-6">Edit Your Research Project</h2>
        
        {loading ? (
          <div className="py-12 text-center text-gray-400">กำลังโหลดข้อมูลเดิม...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1. Project Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-[15px] shadow-sm" />
            </div>

            {/* 2. Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-[15px] shadow-sm">
                <option value="Animation">Animation</option>
                <option value="Web Application">Web Application</option>
                <option value="Mobile Application">Mobile Application</option>
                <option value="IoT / Embedded">IoT / Embedded</option>
              </select>
            </div>

            {/* 3. Advisor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Advisor</label>
              <input type="text" value={advisor} onChange={(e) => setAdvisor(e.target.value)} required
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-[15px] shadow-sm" />
            </div>

            {/* 4. Year & Major */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year</label>
                <input type="text" value={projectYear} onChange={(e) => setProjectYear(e.target.value)} placeholder="2021-2022" required
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-[15px] shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Major</label>
                <select value={major} onChange={(e) => setMajor(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-[15px] shadow-sm">
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                </select>
              </div>
            </div>

            {/* 5. PDF File */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">PDF File (เลือกใหม่เมื่อต้องการเปลี่ยนไฟล์รายงาน)</label>
              <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm border-dashed file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700" />
            </div>

            {/* ปุ่มกด Cancel / Save */}
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose}
                className="w-1/2 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition text-[15px]">
                Cancel
              </button>
              <button type="submit"
                className="w-1/2 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm text-[15px]">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}