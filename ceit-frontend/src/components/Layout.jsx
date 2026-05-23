import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentId, setStudentId] = useState('');
  
  // State สำหรับเก็บคำค้นหาในกล่อง Input
  const [searchQuery, setSearchQuery] = useState('');

  // ซิงค์คำค้นหาในกล่อง Input ให้ตรงกับ URL (กรณีเปลี่ยนหน้าหรือล้างคำค้นหา)
  useEffect(() => {
    const q = searchParams.get('q');
    setSearchQuery(q || '');
  }, [searchParams]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedStudentId = localStorage.getItem('student_id');
    
    if (token) {
      setIsLoggedIn(true);
      setStudentId(savedStudentId || '');
    } else {
      setIsLoggedIn(false);
      setStudentId('');
    }
  }, [location]);

  // ฟังก์ชันดำเนินการค้นหาเมื่อกด Enter หรือคลิกปุ่ม Search
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      // วิ่งไปที่หน้าหลักพร้อมแนบพารามิเตอร์ค้นหา ?q=คำค้นหา
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/'); // ถ้ากล่องค้นหาว่างเปล่า ให้ล้างคำค้นกลับไปหน้าหลัก
    }
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'lo' : 'en');
  };

  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('student_id');
      setIsLoggedIn(false);
      setIsSidebarOpen(false);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Menu 
            className="text-blue-600 cursor-pointer" 
            size={28} 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          />
          <Link to="/" className="text-[20px] font-bold text-blue-600 tracking-tight">
            CEIT Research Showcase
          </Link>
        </div>
        
        {/* Search Bar - Center (แก้ไขให้ใช้งานได้จริง) */}
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
              <Link to="/profile" className="px-5 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                Profile {studentId && `(${studentId})`}
              </Link>
              <button 
                onClick={handleLogout} 
                className="px-5 py-2 text-sm font-medium rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
              >
                Logout
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

      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        {/* Sidebar */}
<aside 
  className={`absolute lg:static top-0 left-0 h-full w-[250px] bg-blue-600 text-white transform transition-transform duration-300 ease-in-out z-40 ${
    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
  } ${isSidebarOpen ? 'lg:translate-x-0' : 'lg:hidden'}`}
>
  <div className="py-6 flex flex-col gap-6 px-8 text-[15px] font-semibold">
    <Link to="/" onClick={() => setIsSidebarOpen(false)} className="hover:text-blue-200 transition">
      Home
    </Link>
    
    {/* แสดงเมนูเพิ่มเติมเฉพาะกลุ่มผู้ใช้ที่ทำการล็อกอินเข้ามาแล้ว */}
    {isLoggedIn && (
      <>
        <Link to="/upload" onClick={() => setIsSidebarOpen(false)} className="hover:text-blue-200 transition">
          Upload Project
        </Link>
        
        <Link to="/profile" onClick={() => setIsSidebarOpen(false)} className="hover:text-blue-200 transition">
          Profile
        </Link>

        {/* --- 🌟 ปุ่ม Search Stats ที่เพิ่มเข้ามาอยู่ด้านล่าง Profile พอดี 🌟 --- */}
        <Link to="/search-stats" onClick={() => setIsSidebarOpen(false)} className="hover:text-blue-200 transition text-amber-300">
          Search Stats
        </Link>
        
        <button onClick={handleLogout} className="text-left mt-8 hover:text-blue-200 transition">
          Logout
        </button>
      </>
    )}
  </div>
</aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}