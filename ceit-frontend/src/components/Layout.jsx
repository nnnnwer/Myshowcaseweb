import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar'; // คอมโพเนนต์ Sidebar ที่สไลด์นุ่มนวล

export default function Layout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState(''); // 🌟 เปลี่ยนชื่อสเตตเป็น displayName เพื่อให้รองรับทั้ง ID และ ชื่อจริง
  const [userRole, setUserRole] = useState(''); // 🌟 เพิ่ม State ไว้จำสิทธิ์ผู้ใช้ปัจจุบัน (student, teacher, general)
  
  // State สำหรับเก็บคำค้นหาในกล่อง Input
  const [searchQuery, setSearchQuery] = useState('');

  // ซิงค์คำค้นหาในกล่อง Input ให้ตรงกับ URL
  useEffect(() => {
    const q = searchParams.get('q');
    setSearchQuery(q || '');
  }, [searchParams]);

  // ติดตามการเปลี่ยนหน้าและดึงข้อมูลสิทธิ์ล่าสุดจากระบบล็อกอิน
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedIdentifier = localStorage.getItem('student_id'); // ค่านี้จะเป็น ID นศ. หรือ ชื่อจริงอาจารย์/คนทั่วไป
    const savedRole = localStorage.getItem('role');
    
    if (token) {
      setIsLoggedIn(true);
      setDisplayName(savedIdentifier || '');
      setUserRole(savedRole || '');
    } else {
      setIsLoggedIn(false);
      setDisplayName('');
      setUserRole('');
    }
  }, [location]);

  // ฟังก์ชันดำเนินการค้นหาเมื่อกด Enter หรือคลิกปุ่ม Search
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/'); 
    }
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'lo' : 'en');
  };

  const handleLogout = () => {
    if (window.confirm('ເຈົ້າຕ້ອງການອອກລະບົບບໍ່?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('student_id');
      localStorage.removeItem('role'); // 🌟 ล้างค่าสิทธิ์ออกจากเครื่องตอนสั่ง Logout
      setIsLoggedIn(false);
      setUserRole('');
      setDisplayName('');
      setIsSidebarOpen(false);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-4">
          
          {/* ปุ่มสามขีดเปิด Sidebar สไตล์มินิมอลสีฟ้า-ขาว */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 bg-blue-500 text-white hover:bg-blue-600 rounded-xl shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center focus:outline-none"
          >
            <Menu size={20} />
          </button>

          {/* หัวข้อหลักบนแถบ Navbar สีฟ้าสไตล์สะอาดตา */}
          <div>
            <Link to="/" className="text-[18px] font-bold text-gray-800 tracking-tight hover:text-blue-600 transition-colors block">
               CEIT Showcase
            </Link>
            <p className="text-[11px] text-gray-400">ຄະນະວິສະວະກຳສາດ</p>
          </div>
        </div>
        
        {/* Search Bar - Center */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('Search projects')} 
            className="w-full bg-white border border-gray-200 rounded-full pl-5 pr-12 py-2.5 text-sm focus:outline-none focus:border-blue-500 shadow-sm"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <Search size={16} />
          </button>
        </form>

        {/* Action Buttons - Right */}
        <div className="flex items-center gap-3">
          <button onClick={toggleLanguage} className="text-sm font-semibold text-gray-600 hover:text-blue-600 mr-2">
            {i18n.language === 'en' ? 'ລາວ' : 'EN'}
          </button>
          
          {isLoggedIn ? (
            <>
              {/* 🌟 3. ปรับปรุงจุดนี้: แสดงชื่อจริงหรือรหัสนักศึกษาตามสิทธิ์ผู้ใช้ให้ถูกต้องสวยงามบนปุ่มโปรไฟล์ */}
              <Link to="/profile" className="px-5 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition max-w-[180px] truncate">
                {userRole === 'student' ? `ໂປຣໄຟລ໌ (${displayName})` : `ໂປຣໄຟລ໌: ${displayName}`}
              </Link>
              <button 
                onClick={handleLogout} 
                className="px-5 py-2 text-sm font-medium rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
              >
                ອອກຈາກລະບົບ
              </button>
            </>
          ) : (
            <>
              {location.pathname === '/login' || location.pathname === '/register' ? (
                <Link to="/" className="px-5 py-2 text-sm font-medium rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition">
                  Home
                </Link>
              ) : (
                <Link to="/register" className="px-5 py-2 text-sm font-medium rounded-lg bg-[#5A6A85] hover:bg-slate-700 text-white transition">
                  {t('Register')}
                </Link>
              )}

              {location.pathname !== '/login' && (
                <Link to="/login" className="px-5 py-2 text-sm font-medium rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition">
                  {t('Login')}
                </Link>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* คอมโพเนนต์ Sidebar ที่เปิดรับ Props คุมสถานะความสมูทในการเปิดปิดสิทธิ์เข้าถึง */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* พื้นที่แสดงเนื้อหาเพจในหน้าต่างๆ */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}