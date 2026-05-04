import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';

export default function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!project) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  // ... (ส่วน useEffect ดึงข้อมูล project เหมือนเดิม) ...

return (
  <div className="...">
    <h1 className="text-[26px] font-bold mb-8">{project.title}</h1>
    
    <div className="w-full bg-[#323639] rounded-xl overflow-hidden" style={{ height: '80vh' }}>
      {project.pdf_url ? (
        <iframe 
          // ดึงไฟล์จากโฟลเดอร์ uploads ของ Backend (พอร์ต 5000)
          src={`http://localhost:5000/uploads/${project.pdf_url}`} 
          className="w-full h-full"
          title="PDF Viewer"
        ></iframe>
      ) : (
        <div className="text-white p-10">ไม่พบไฟล์ PDF สำหรับโปรเจกต์นี้</div>
      )}


      
    </div>
  </div>

  
);
}