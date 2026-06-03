import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, FileText, Calendar, ShieldAlert } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function Profile() {
  const [myProjects, setMyProjects] = useState([]);
  const studentId = localStorage.getItem('student_id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // ดึงเฉพาะโปรเจกต์ที่เป็นของ user id คนนี้
        axios.get('http://localhost:5000/api/projects')
          .then(res => {
            // กรองข้อมูลเอาเฉพาะงานที่ user_id ตรงกับคนที่ล็อกอินอยู่
            const allProjects = res.data.projects || res.data || [];
            const filtered = allProjects.filter(p => p.user_id === decoded.id);
            setMyProjects(filtered);
          })
          .catch(err => console.error(err));
      } catch (err) {
        console.error(err);
      }
    }
  }, [token]);

  // ระบบป้องกัน: ถ้าไม่ได้ล็อกอิน ไม่ยอมให้เข้าหน้านี้
  if (!token || !studentId) {
    return (
      <div className="max-w-[500px] mx-auto mt-20 p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
        <ShieldAlert className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-[20px] font-bold text-gray-900 mb-2">กรุณาเข้าสู่ระบบก่อนครับ</h3>
        <p className="text-gray-500 text-[15px]">คุณต้องเข้าสู่ระบบเพื่อเข้าถึงหน้าข้อมูลโปรไฟล์ส่วนตัว</p>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto p-6 mt-6">
      {/* ส่วนหัวการ์ดโปรไฟล์หลัก */}
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
          <User size={40} />
        </div>
        <div className="text-center md:text-left flex-1">
          <p className="text-[13px] font-bold text-blue-500 uppercase tracking-wider mb-1">CEIT Student Account</p>
          <h2 className="text-[28px] font-bold text-gray-900 font-mono mb-1">{studentId}</h2>
          <p className="text-[14px] text-gray-400">Faculty of Engineering, CEIT Department</p>
        </div>
        <div className="bg-gray-50 px-6 py-4 rounded-2xl text-center border border-gray-100">
          <span className="block text-[22px] font-bold text-gray-900 font-mono">{myProjects.length}</span>
          <span className="text-[13px] text-gray-500 font-medium">Uploaded Papers</span>
        </div>
      </div>

      {/* รายการผลงานวิจัยที่นักศึกษาคนนี้เคยลงไว้ */}
      <h3 className="text-[18px] font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FileText size={20} className="text-gray-500" /> ผลงานวิจัยของฉัน
      </h3>

      <div className="space-y-4">
        {myProjects.length > 0 ? (
          myProjects.map(project => (
            <div key={project.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center transition-all hover:border-blue-200">
              <div>
                <h4 className="text-[16px] font-bold text-gray-900 mb-1">{project.title}</h4>
                <div className="flex gap-4 text-[13px] text-gray-400 font-medium">
                  <span className="text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full text-[12px]">{project.category}</span>
                  <span className="flex items-center gap-1"><Calendar size={14}/> {project.project_year}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 text-[15px]">
            คุณยังไม่เคยอัปโหลดผลงานวิจัยในระบบนี้เลยครับ
          </div>
        )}
      </div>
    </div>
  );
}