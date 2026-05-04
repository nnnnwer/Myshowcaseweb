import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'lo' : 'en');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white px-6 py-3 flex justify-between items-center sticky top-0 z-50">
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
        
        {/* Search Bar - Center */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
          <input 
            type="text" 
            placeholder={t('Search projects')} 
            className="w-full bg-white border border-gray-200 rounded-full pl-5 pr-12 py-2.5 text-sm focus:outline-none focus:border-blue-500 shadow-sm"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors">
            <Search size={16} />
          </button>
        </div>

        {/* Action Buttons - Right */}
        <div className="flex items-center gap-3">
          <button onClick={toggleLanguage} className="text-sm font-semibold text-gray-600 hover:text-blue-600 mr-2">
            {i18n.language === 'en' ? 'ລາວ' : 'EN'}
          </button>
          
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
        </div>
      </nav>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`absolute lg:static top-0 left-0 h-full w-[250px] bg-blue-600 text-white transform transition-transform duration-300 ease-in-out z-40 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isSidebarOpen ? 'lg:translate-x-0' : 'lg:hidden'}`}
        >
          <div className="py-6 flex flex-col gap-6 px-8 text-[15px] font-semibold">
            <Link to="/" className="hover:text-blue-200 transition">Home</Link>
            <Link to="/upload" className="hover:text-blue-200 transition">Upload Project</Link>
            <Link to="/profile" className="hover:text-blue-200 transition">Profile</Link>
            <button className="text-left mt-8 hover:text-blue-200 transition">Logout</button>
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