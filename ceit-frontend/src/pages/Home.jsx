import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Eye, GraduationCap, Calendar, Trash2, Star, Pencil } from 'lucide-react'; // 🌟 ดึงคอมโพเนนต์ GraduationCap มาใช้งานเต็มระบบ
import { jwtDecode } from 'jwt-decode'; 
import EditModal from '../components/EditModal';
import Pagination from '../components/Pagination';
import FilterBar from '../components/FilterBar'; 

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);

  // สมองจำค่าการคัดกรองและจัดเรียงข้อมูล 
  const [filters, setFilters] = useState({ sort: '', major: '', time: '', project_year: '', category: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.id);
    }
  }, []);

  // ติดตามสถานะเมื่อตัวเลือกการคัดกรองหรือหน้าเพจเปลี่ยน เพื่อดึงข้อมูลใหม่ทันที
  useEffect(() => {
    fetchProjects(currentPage);
  }, [searchParams, currentPage, filters]);

  // ฟังก์ชันยิง API เชื่อมต่อท่อหลังบ้าน พร้อมแนบตัวแปรคัดกรองครบชุด
  const fetchProjects = async (page) => {
    try {
      const q = searchParams.get('q');
      
      let url = `http://localhost:5000/api/projects?page=${page}&sort=${filters.sort}&major=${filters.major}&time=${filters.time}&project_year=${filters.project_year}&category=${filters.category}`;
      
      if (q) {
        url = `http://localhost:5000/api/search?q=${encodeURIComponent(q)}`;
      }
      
      const res = await axios.get(url);
      
      if (q) {
        setProjects(Array.isArray(res.data) ? res.data : []);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        setProjects(res.data?.projects || []);
        setTotalPages(res.data?.totalPages || 1);
        setCurrentPage(res.data?.currentPage || 1);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  // ฟังก์ชันช่วยคำนวณสีป้ายหมวดหมู่แบบ Dynamic แยกตามประเภทงานวิจัย 🌟
  const getCategoryColor = (category) => {
    const cat = category?.toLowerCase()?.trim();
    
    if (cat === 'network') {
      return 'bg-purple-50 text-purple-600 border border-purple-100'; // 💜 สายเน็ตเวิร์กโชว์สีม่วงพาสเทล
    }
    if (cat === 'animation') {
      return 'bg-pink-50 text-pink-600 border border-pink-100'; // 💗 สายแอนิเมชันโชว์สีชมพูหวาน
    }
    if (cat === 'database') {
      return 'bg-emerald-50 text-emerald-600 border border-emerald-100'; // 💚 สายดาต้าเบสโชว์สีเขียวมรกต
    }
    // 🌟 เพิ่มป้ายสีฟ้าซีดพาสเทลให้กับเล่มโครงงานสายฮาร์ดแวร์ IoT ตัวใหม่
    if (cat === 'iot') {
      return 'bg-sky-50 text-sky-600 border border-sky-100'; // 💙 สาย IoT โชว์สีฟ้าน้ำทะเลมินิมอล
    }
    
    return 'bg-orange-50 text-orange-600 border border-orange-100';
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // รีเซ็ตกลับไปหน้าแรกทุกครั้งที่มีการเปลี่ยนเงื่อนไขคัดกรอง
  };

  const handleDelete = async (id) => {
    if (window.confirm('ยืนยันการลบโปรเจกต์นี้?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProjects(currentPage);
      } catch (error) {
        alert('ไม่สามารถลบได้: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleRate = async (projectId, score) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/projects/${projectId}/rate`, 
        { rating: score },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchProjects(currentPage); 
    } catch (error) {
      alert('ກະລຸນາເຂົ້າລະບົບກ່ອນ');
    }
  };

  return (
    <div className="w-full">
      
      {/* แถบเครื่องมือคัดกรองที่ตอนนี้บรรจุกระบอก Dropdown เลือกหมวดหมู่สีฟ้าตัวใหม่ไว้แล้ว */}
      <FilterBar onFilterChange={handleFilterChange} activeFilters={filters} />

      {/* ส่วนแสดงผลรายการการ์ดโปรเจกต์งานวิจัย */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects?.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 relative group flex flex-col transition-all hover:shadow-md">
              
              <div className="mb-4">
                <span className={`text-[14px] font-bold px-5 py-1.5 rounded-full transition-colors ${getCategoryColor(project.category)}`}>
                  {project.category || 'General'}
                </span>
              </div>

              <h3 className="text-[22px] font-bold text-gray-900 mb-6 leading-tight">
                {project.title}
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-gray-500 text-[15px]">
                  <Eye size={18} className="text-gray-400" />
                  <span>{project.views || 0} views</span>
                </div>
                
                {/* 🌟 1. จุดแก้ไขจุดที่หนึ่ง: ปรับเปลี่ยนจากตัวอีโมจิ 🧑‍🏫 สลับมาใช้คอมโพเนนต์ไอคอนกล่องพาสเทลเหลือง-ส้มแมตช์เข้าชุดกัน */}
                <div className="flex items-center gap-2 text-[15px]">
                  <div className="w-5 h-5 rounded-md bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100 shadow-sm">
                    <GraduationCap size={13} fill="#f59e0b" />
                  </div>
                  <span className="text-gray-600 font-medium">{project.advisor || 'Aj Example'}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-500 text-[15px]">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap size={20} className="text-gray-400" />
                    <span className="text-gray-600">{project.major || 'CE'}</span>
                  </div>
                  
                  <span className="text-gray-300">|</span>
                  
                  <div className="flex items-center gap-1.5">
                    <Calendar size={18} className="text-gray-400" />
                    <span className="text-gray-600">{project.project_year || '2025-2026'}</span>
                  </div>
                </div>
              </div>

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

              <div className="mt-auto pt-5 border-t border-gray-50">
                <button 
                  onClick={() => navigate(`/view/${project.id}`)}
                  className="text-[16px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View Project →
                </button>
              </div>

              {/* ปุ่มจัดการแก้ไข/ลบ จะโชว์ขึ้นมาเฉพาะเมื่อ Account ล็อกอินตรงกับผู้สร้างโปรเจกต์ */}
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
            ບໍ່ພົບຂໍ້ມູນບົດວິໄຈໃນໜ້ានີ້
          </div>
        )}
      </div>

      {/* คอมโพเนนต์ Pagination จัดการแบ่งหน้าแสดงผล */}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={(targetPage) => setCurrentPage(targetPage)} 
      />

      {/* หน้าต่าง Modal เด้งขึ้นมาแก้ไขข้อมูลโปรเจกต์งานวิจัย */}
      <EditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        projectId={editingProjectId}
        onUpdateSuccess={() => fetchProjects(currentPage)} 
      />
    </div>
  );
}