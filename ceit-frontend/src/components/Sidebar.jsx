import { X, Home, User, Upload, BarChart3, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const menuItems = [
    { text: 'ໜ້າຫຼັກ', icon: <Home size={20} />, path: '/' },
    { text: 'ໂປຣໄຟລ໌', icon: <User size={20} />, path: '/profile' },
    { text: 'ອັບໂຫຼດບົດວິໄຈ', icon: <Upload size={20} />, path: '/upload' },
    { text: 'ສະຖິຕິການຄົ້ນຫາ', icon: <BarChart3 size={20} />, path: '/search-stats' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // คลิกแล้วให้ปิดสไลด์อัตโนมัติ
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student_id');
    handleNavigation('/login');
  };

  return (
    <>
      {/* 1. Backdrop เคลือบพื้นหลังสีดำโปร่งแสงตอนเปิดเมนู (คลิกพื้นที่ว่างเพื่อปิดได้) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 2. ตัวกล่อง Sidebar สไลด์นุ่มนวล คุมโทนสีขาว-ฟ้า เสริมฟอนต์ Saysetha OT */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col font-sans ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* หัวข้อด้านบนสุดของ Sidebar */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-500 text-white rounded-tr-[24px]">
          <div>
            <h2 className="text-[18px] font-bold leading-tight">CEIT Showcase</h2>
            <p className="text-[12px] opacity-80">ຄະນະວິສະວະກຳສາດ</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-blue-600 rounded-lg transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* รายการปุ่มเมนูต่างๆ */}
        <div className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-bold text-[15px] transition-all duration-200 group text-left"
            >
              <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                {item.icon}
              </div>
              {item.text}
            </button>
          ))}
        </div>

        {/* ปุ่มออกจากระบบด้านล่างสุด */}
        {token && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-bold text-[15px] transition-colors text-left"
            >
              <LogOut size={20} />
              ອອກຈາກລະບົບ
            </button>
          </div>
        )}
      </div>
    </>
  );
}