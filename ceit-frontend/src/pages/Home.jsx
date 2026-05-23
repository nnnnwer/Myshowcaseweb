import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Eye, GraduationCap, Calendar, Trash2, Star, Pencil } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; 
import EditModal from '../components/EditModal';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);

  // 1. ตรวจสอบสถานะ User (รันครั้งเดียวตอนโหลดคอมโพเนนต์)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.id);
    }
  }, []);

  // 2. ติดตามพารามิเตอร์การค้นหาจาก URL (ทำงานทุกครั้งที่ searchParams เปลี่ยน)
  useEffect(() => {
    fetchProjects();
  }, [searchParams]);

  // 3. ฟังก์ชันดึงข้อมูลโครงการทั้งหมด/ผลการค้นหา
  const fetchProjects = async () => {
    try {
      const q = searchParams.get('q');
      let url = 'http://localhost:5000/api/projects';
      
      if (q) {
        url = `http://localhost:5000/api/search?q=${encodeURIComponent(q)}`;
      }
      
      const res = await axios.get(url);
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // 4. ฟังก์ชันลบโปรเจกต์
  const handleDelete = async (id) => {
    if (window.confirm('ยืนยันการลบโปรเจกต์นี้?')) {
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

  // 5. ฟังก์ชันส่งคะแนนเรตติ้งดาว
  const handleRate = async (projectId, score) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/projects/${projectId}/rate`, 
        { rating: score },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchProjects(); 
    } catch (error) {
      alert('กรุณาเข้าสู่ระบบก่อนให้คะแนนครับ');
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 relative group flex flex-col transition-all hover:shadow-md">
              
              {/* 1. Category Badge */}
              <div className="mb-4">
                <span className="bg-pink-50 text-pink-600 text-[14px] font-bold px-5 py-1.5 rounded-full">
                  {project.category || 'Animation'}
                </span>
              </div>

              {/* 2. Title */}
              <h3 className="text-[22px] font-bold text-gray-900 mb-6 leading-tight">
                {project.title}
              </h3>
              {/* ลบตัวหนังสือหมวดหมู่สีเทาด้านล่างออกเรียบร้อยตามบรีฟ */}

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

                {/* แสดงข้อมูล Major และ Year คู่กับไอคอนจริงจาก Database */}
                <div className="flex items-center gap-3 text-gray-500 text-[15px]">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap size={20} className="text-gray-400" />
                    <span className="text-gray-600">{project.major || 'CE'}</span>
                  </div>
                  
                  <span className="text-gray-300">|</span>
                  
                  <div className="flex items-center gap-1.5">
                    <Calendar size={18} className="text-gray-400" />
                    <span className="text-gray-600">{project.project_year || '2021-2022'}</span>
                  </div>
                </div>
              </div>

              {/* 4. Rating Section */}
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

              {/* ปุ่มจัดการ (Edit & Delete) โชว์เฉพาะเจ้าของโปรเจกต์เมื่อวางเมาส์ */}
              {project.user_id === currentUserId && (
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => {
                      setEditingProjectId(project.id);
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 bg-white shadow-sm border border-gray-100 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>

                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 bg-white shadow-sm border border-gray-100 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400 text-[16px]">
            ไม่พบข้อมูลโปรเจกต์ที่ตรงกับคำค้นหาของคุณ
          </div>
        )}
      </div>

      {/* เรียกใช้งาน EditModal ส่วนกลางท้ายไฟล์ */}
      <EditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        projectId={editingProjectId}
        onUpdateSuccess={fetchProjects} 
      />
    </div>
  );
}