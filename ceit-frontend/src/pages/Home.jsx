import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, GraduationCap, Calendar, Trash2, Star } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; 

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.id);
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('ยืนยันการลบ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProjects();
      } catch (error) {
        alert('ไม่สามารถลบได้: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  // ฟังก์ชันส่งคะแนนไปยัง Backend
  const handleRate = async (projectId, score) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/projects/${projectId}/rate`, 
        { rating: score },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchProjects(); // โหลดข้อมูลใหม่เพื่ออัปเดตคะแนนเฉลี่ยบนหน้าจอ
    } catch (error) {
      alert('กรุณาเข้าสู่ระบบก่อนให้คะแนนครับ');
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map(project => (
        <div key={project.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 relative group flex flex-col transition-all hover:shadow-md">
          
          {/* 1. Category Badge */}
          <div className="mb-4">
            <span className="bg-pink-50 text-pink-600 text-[14px] font-bold px-5 py-1.5 rounded-full">
              {project.category || 'Animation'}
            </span>
          </div>

          {/* 2. Title & Subtitle */}
          <h3 className="text-[22px] font-bold text-gray-900 mb-1 leading-tight">
            {project.title}
          </h3>
          <p className="text-gray-400 text-[16px] mb-6">
            {project.category || 'Animation'}
          </p>

          {/* 3. Stats & Info */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2 text-gray-500 text-[15px]">
              <Eye size={18} className="text-gray-400" />
              <span>{project.views || 0} views</span>
            </div>
            
            <div className="flex items-center gap-2 text-[15px]">
              <span className="text-[18px]">🧑‍🏫</span>
              <span className="text-blue-400 font-medium">{project.advisor || 'Aj Example'}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <GraduationCap size={22} />
              <span className="text-gray-200">|</span>
              <Calendar size={22} />
            </div>
          </div>

          {/* 4. Rating Section (ระบบดาวที่กดได้จริง) */}
          <div className="mb-8">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(project.id, star)}
                  className="focus:outline-none transition-transform hover:scale-125"
                >
                  <Star 
                    size={22} 
                    // ระบายสีดาวตามค่าเฉลี่ย (avg_rating) จาก Database
                    fill={star <= Math.round(project.avg_rating || 0) ? "#FACC15" : "none"} 
                    className={star <= Math.round(project.avg_rating || 0) ? "text-yellow-400" : "text-gray-300"}
                  />
                </button>
              ))}
            </div>
            <p className="text-[13px] text-gray-500">
              Average: {Number(project.avg_rating || 0).toFixed(2)} ({project.rating_count || 0} ratings)
            </p>
          </div>

          {/* 5. Footer Link */}
          <div className="mt-auto pt-5 border-t border-gray-50">
            <button 
              onClick={() => navigate(`/view/${project.id}`)}
              className="text-[16px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              View Project →
            </button>
          </div>

          {/* ปุ่ม Delete (แสดงเฉพาะเจ้าของเมื่อ Hover) */}
          {project.user_id === currentUserId && (
            <button 
              onClick={() => handleDelete(project.id)}
              className="absolute top-6 right-6 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-full hover:bg-red-50"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}