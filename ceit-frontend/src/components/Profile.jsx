import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, FileText, Calendar, ShieldAlert, Phone, BookOpen, Download, MessageSquare, Pencil, Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const token = localStorage.getItem('token');

  // 🌟 State ສຳລັບລະບົບແກ້ໄຂຂໍ້ມູນສ່ວນຕົວ
  const [isEditing, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTel, setEditTel] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 🌟 State ຄຸມການເປີດ-ປິດຕາເບິ່ງລະຫັດ

  const fetchProfileData = () => {
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // ດຶງຂໍ້ມູນ Profile ຜູ້ໃຊ້ປັດຈຸບັນ
        axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
          setUserInfo(res.data);
          setEditName(res.data.name || '');
          setEditTel(res.data.tel || '');
        })
        .catch(err => console.error("Error fetching profile:", err));

        // ດຶງໂຄງງານມາກອງສະແດງຜົນ
        axios.get('http://localhost:5000/api/projects')
          .then(res => {
            const allProjects = res.data.projects || res.data || [];
            const filtered = allProjects.filter(p => p.user_id === decoded.id);
            setMyProjects(filtered);
          })
          .catch(err => console.error("Error fetching projects:", err));

      } catch (err) {
        console.error("Token decode error:", err);
      }
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [token]);

  // ຟັງກ໌ຊັນກົດບັນທຶກການແກ້ໄຂໂປຣໄຟລ໌
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/auth/profile', {
        name: userInfo.role === 'student' ? null : editName,
        tel: editTel,
        password: editPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('ອັບເດດຂໍ້ມູນໂປຣໄຟລ໌ສຳເລັດແລ້ວ!');
      setIsEditMode(false);
      setEditPassword('');
      fetchProfileData(); // ໂຫຼດຂໍ້ມູນໃໝ່ຫຼ້າສຸດມາສະແດງ
    } catch (error) {
      alert(error.response?.data?.error || 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດ');
    }
  };

  // ລະບົບປ້ອງກັນຄວາມປອດໄພ
  if (!token) {
    return (
      <div className="max-w-[500px] mx-auto mt-20 p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm font-sans">
        <ShieldAlert className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-[20px] font-bold text-gray-900 mb-2">ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ</h3>
        <p className="text-gray-500 text-[15px]">ທ່ານຕ້ອງເຂົ້າສູ່ລະບົບເພື່ອເຂົ້າເຖິງໜ້າຂໍ້ມູນໂປຣໄຟລ໌ສ່ວນຕົວ</p>
      </div>
    );
  }

  if (!userInfo) {
    return <div className="text-center py-12 text-gray-400 text-[16px] font-sans">ກຳລັງໂຫລດຂໍ້ມູນໂປຣໄຟລ໌...</div>;
  }

  const getRoleBadge = (role) => {
    if (role === 'student') return { label: 'ນັກສຶກສາ CEIT', style: 'bg-purple-50 text-purple-600 border-purple-100' };
    if (role === 'teacher') return { label: 'ອາຈານ / ວິຊາການ', style: 'bg-amber-50 text-amber-600 border-amber-100' };
    return { label: 'ຄົນທົ່ວໄປ', style: 'bg-gray-100 text-gray-600 border-gray-200' };
  };

  const badge = getRoleBadge(userInfo.role);

  return (
    <div className="max-w-[800px] mx-auto p-6 mt-6 font-sans">
      
      {/* 💳 ສ່ວນຫົວການ໌ດໂປຣໄຟລ໌ຫຼັກ (ສະຫຼັບໂໝດສະແດງຜົນ / ໂໝດແກ້ໄຂ) */}
      <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 relative mb-8">
        
        {!isEditing ? (
          /* 1. ໂໝດສະແດງຜົນປົກກະຕິ (View Mode) */
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
              <User size={40} />
            </div>
            <div className="text-center md:text-left flex-1">
              <span className={`inline-block text-[12px] font-bold px-3 py-1 rounded-full border mb-2 ${badge.style}`}>
                {badge.label}
              </span>
              
              <h2 className="text-[28px] font-bold text-gray-900 mb-1 leading-tight">
                {userInfo.role === 'student' ? userInfo.student_id : userInfo.name}
              </h2>
              
              <p className="text-[14px] text-gray-400 flex items-center justify-center md:justify-start gap-1.5 mt-1">
                <Phone size={14} className="text-gray-300" /> {userInfo.tel || 'ບໍ່ມີຂໍ້ມູນເບີໂທ'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* ປຸ່ມກົດເຂົ້າສູ່ໂໝດແກ້ໄຂຂໍ້ມູນ */}
              <button
                onClick={() => setIsEditMode(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-xl border border-blue-100 shadow-sm transition-all"
              >
                <Pencil size={14} /> ແກ້ໄຂໂປຣໄຟລ໌
              </button>

              {userInfo.role === 'student' && (
                <div className="bg-gray-50 px-5 py-3 rounded-2xl text-center border border-gray-100 min-w-[120px]">
                  <span className="block text-[22px] font-bold text-gray-800 font-mono">{myProjects.length}</span>
                  <span className="text-[11px] text-gray-500 font-bold">ບົດວິໄຈທີ່ອັບໂຫລດ</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 2. 🌟 ໂໝດແກ້ໄຂຂໍ້ມູນໂປຣໄຟລ໌ (Edit Mode) */
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-2">
              <h4 className="text-[18px] font-bold text-gray-800 flex items-center gap-2">📝 ແກ້ໄຂຂໍ້ມູນສ່ວນຕົວ</h4>
              <span className={`text-[12px] font-bold px-3 py-0.5 rounded-full border ${badge.style}`}>{badge.label}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ຖ້າເປັນນັກສຶກສາ ຈະລັອກຫ້າມແກ້ໄຂ ID, ແຕ່ຖ້າເປັນສິດອື່ນ ຈະເປີດໃຫ້ແກ້ໄຂຊື່ແທ້ໄດ້ */}
              {userInfo.role === 'student' ? (
                <div>
                  <label className="block text-[13px] font-bold text-gray-500 mb-1.5">ລະຫັດນັກສຶກສາ (ລັອກໄວ້)</label>
                  <input type="text" disabled value={userInfo.student_id} className="w-full bg-gray-50 border border-gray-200 text-gray-400 rounded-xl px-4 py-2.5 text-sm font-mono cursor-not-allowed" />
                </div>
              ) : (
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">{userInfo.role === 'teacher' ? 'ຊື່ອາຈານ' : 'ຊື່ ແລະ ນາມສະກຸນ'}</label>
                  <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none transition-colors" />
                </div>
              )}

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">ເບີໂທລະສັບ</label>
                <input type="tel" required value={editTel} onChange={(e) => setEditTel(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none transition-colors" />
              </div>
            </div>

            {/* 🌟 ປຸ່ມປ້ອນລະຫັດຜ່ານໃໝ່ ພ້ອມປຸ່ມກົດເປີດຕາ (Eye Toggle Password) */}
            <div className="relative max-w-sm">
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">ປ່ຽນລະຫັດຜ່ານໃໝ່ (ປ້ອນເມື່ອຕ້ອງການປ່ຽນເທົ່ານັ້ນ)</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-12 py-2.5 text-sm focus:border-blue-500 outline-none transition-colors"
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                
                {/* 👁️ ປຸ່ມກົດເປີດ-ປິດຕາມອງເຫັນລະຫັດຜ່ານ */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ກຸ່ມປຸ່ມກົດ ບັນທຶກ ຫຼື ຍົກເລີກ */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                <Check size={14} /> ບັນທຶກຂໍ້ມູນ
              </button>
              <button
                type="button"
                onClick={() => { setIsEditMode(false); setEditPassword(''); setShowPassword(false); }}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition-colors"
              >
                <X size={14} /> ຍົກເລີກ
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ສ່ວນເນື້ອຫາເຄິ່ງລຸ່ມ (ຄືເກົ່າກັບຮອບທີ່ແລ້ວເລີຍຄຮັບ) */}
      {userInfo.role === 'student' ? (
        <>
          <h3 className="text-[18px] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-gray-500" /> ບົດວິໄຈຂອງຂ້ອຍ
          </h3>
          <div className="space-y-4">
            {myProjects.length > 0 ? (
              myProjects.map(project => (
                <div key={project.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center transition-all hover:border-blue-200">
                  <div>
                    <h4 className="text-[16px] font-bold text-gray-900 mb-1 leading-snug">{project.title}</h4>
                    <div className="flex gap-4 text-[13px] text-gray-400 font-medium mt-1">
                      <span className="text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full text-[12px] font-bold">{project.category}</span>
                      <span className="flex items-center gap-1"><Calendar size={14}/> {project.project_year}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 text-[15px]">
                ທ່ານຍັງບໍ່ເຄີຍອັບໂຫລດບົດວິໄຈໃນລະບົບນີ້ເທື່ອ.
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <h3 className="text-[18px] font-bold text-gray-900 mb-4 flex items-center gap-2">
            🛡️ ສິດທິການນຳໃຊ້ລະບົບຂອງທ່ານ
          </h3>
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
            <p className="text-[15px] text-gray-500 mb-2">
              ບັນຊີຂອງທ່ານຖືກກຳນົດສິດເປັນ <strong className="text-blue-600">{badge.label}</strong> ເຊິ່ງສາມາດຈັດການວຽກພາຍໃນລະບົບໄດ້ດັ່ງນີ້:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-50 flex flex-col items-center text-center">
                <BookOpen className="text-blue-500 mb-2" size={24} />
                <h5 className="text-[14px] font-bold text-gray-800 mb-1">ອ່ານບົດວິໄຈ</h5>
                <p className="text-[11px] text-gray-400">ເຂົ້າເບິ່ງເນື້ອຫາ ແລະ ລາຍລະອຽດໂຄງງານທັງໝົດໄດ້</p>
              </div>
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-50 flex flex-col items-center text-center">
                <Download className="text-emerald-500 mb-2" size={24} />
                <h5 className="text-[14px] font-bold text-gray-800 mb-1">ດາວໂຫລດ PDF</h5>
                <p className="text-[11px] text-gray-400">ດາວໂຫລດໄຟລ໌ເລັ້ມວິໄຈໄປສຶກສາຕໍ່ໄດ້ຟຣີ</p>
              </div>
              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-50 flex flex-col items-center text-center">
                <MessageSquare className="text-purple-500 mb-2" size={24} />
                <h5 className="text-[14px] font-bold text-gray-800 mb-1">ອອກຄວາມຄິດເຫັນ</h5>
                <p className="text-[11px] text-gray-400">ພິມຄອມເມັ້ນແແລກປ່ຽນຄວາມຮູ້ພ້ອມແທັກບອກຊື່ໄດ້</p>
              </div>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-[13px] text-amber-700 flex items-start gap-2 mt-2">
              <span>💡</span>
              <p>ໝາຍເຫດ: ຫາກທ່ານມີຄວາມຕ້ອງການອັບໂຫລດເລັ້ມບົດວິໄຈຄະນະວິສະວະກຳສາດຂຶ້ນລະບົບ ກະລຸນາຕິດຕໍ່ພົວພັນກັບເຈົ້າໜ້າທີ່ພາກວິຊາ CEIT ເພື່ອປ່ຽນແປງສິດທິບັນຊີ.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}