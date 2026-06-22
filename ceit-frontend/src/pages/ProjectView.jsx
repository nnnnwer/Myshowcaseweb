import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Trash2, GraduationCap } from 'lucide-react'; // 🌟 1. Import GraduationCap ເຂົ້າມາໃຊ້ງານ
import { jwtDecode } from 'jwt-decode'; 

export default function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // State ສຳລັບເກັບ ID ຂອງຜູ້ໃຊ້ງານປັດຈຸບັນ
  const [currentUserId, setCurrentUserId] = useState(null);

  // ດັກແກະລົງທະບຽນ ID ຄົນລັອກອິນ
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id);
      } catch (err) {
        console.error('Token decode error:', err);
      }
    }
  }, []);

  // 1. ດຶງຂໍ້ມູນໂປຣເຈັກ
  useEffect(() => {
    axios.get(`http://localhost:5000/api/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // 2. ດຶງຄອມເມັ້ນ
  useEffect(() => {
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/projects/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  // 3. ຟັງກ໌ຊັນສົ່ງຄອມເມັ້ນໃໝ່
  const handlePostComment = async () => {
    if (!newMessage.trim()) return; 
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/projects/${id}/comments`, 
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setNewMessage(''); 
      fetchComments();   
    } catch (err) {
      alert('ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນສະແດງຄວາມຄິດເຫັນຄຮັບ');
    }
  };

  // 4. ຟັງກ໌ຊັນລົບຄອມເມັ້ນ
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('ທ່ານຕ້ອງການລົບຄອມເມັ້ນນີ້ແທ້ບໍ່?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('ລົບຄອມເມັ້ນສຳເລັດ!');
        fetchComments(); 
      } catch (error) {
        alert(error.response?.data?.error || 'ບໍ່ສາມາດລົບໄດ້');
      }
    }
  };

  if (!project) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-[1200px] mx-auto p-6 font-sans">
      {/* ສ່ວນຫົວໜ້າເວັບພ້ອມປຸ່ມຍ້ອນກັບ */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[26px] font-bold text-gray-900">{project.title}</h1>
      </div>
      
      {/* ກອບສະແດງ PDF */}
      <div className="w-full bg-[#323639] rounded-xl overflow-hidden shadow-lg mb-8" style={{ height: '80vh' }}>
        {project.pdf_url ? (
          <iframe 
            src={`http://localhost:5000/uploads/${project.pdf_url}`} 
            className="w-full h-full"
            title="PDF Viewer"
          ></iframe>
        ) : (
          <div className="text-white p-10 flex items-center justify-center h-full">ບໍ່ພົບໄຟລ໌ PDF ສຳລັບໂປຣເຈັກນີ້</div>
        )}
      </div>

      {/* --- ສ່ວນກ້ອງ Comments --- */}
      <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100">
        <h3 className="text-[20px] font-bold mb-6 text-gray-800">Comments ({comments.length})</h3>
        
        {/* ລາຍການຄອມເມັ້ນ */}
        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
          {comments.length > 0 ? (
            comments.map(c => (
              <div key={c.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 relative group transition-all">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  
                  {/* ສະແດງຊື່ ຫຼື ID ຕາມສິດຜູ້ໃຊ້ */}
                  <span className="text-[14px] font-bold text-gray-800">
                    {c.role === 'student' ? `ID: ${c.student_id}` : c.name}
                  </span>
                  
                  {/* ປ້າຍບອກລະດັບສິດທິ */}
                  {c.role === 'student' && (
                    <span className="px-2.5 py-0.5 bg-purple-50 text-purple-600 text-[11px] font-bold rounded-full border border-purple-100">🎓 ນັກສຶກສາ</span>
                  )}
                  
                  {/* 🌟 2. ຈຸດແກ້ໄຂ: ປ່ຽນຈາກ 🧑‍🏫 ມາເປັນ ໄອຄອນ GraduationCap ສີສົ້ມພασເທລຫຼູຫຼາ */}
                  {c.role === 'teacher' && (
                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 text-[11px] font-bold rounded-full border border-amber-100 flex items-center gap-1">
                      <GraduationCap size={12} fill="#d97706" className="text-amber-600" /> ອາຈານ
                    </span>
                  )}
                  
                  {c.role === 'general' && (
                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-full border border-gray-200">🌍 ຄົນທົ່ວໄປ</span>
                  )}
                  
                  {/* ສະແດງວັນທີ ແລະ ເວລາ */}
                  <span className="text-gray-400 text-[11px] font-mono">
                    {new Date(c.created_at).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </span>

                  {/* ປຸ່ມລົບຄອມເມັ້ນສະເພາະເຈົ້າຂອງ */}
                  {c.user_id === currentUserId && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="ml-auto text-gray-400 hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50 transition-colors duration-200"
                      title="ລົບຄອມເມັ້ນ"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* ຂໍ້ຄວາມຄອມເມັ້ນ */}
                <p className="text-gray-700 text-[15px] leading-relaxed pl-1">{c.message}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-6 text-[15px]">ຍັງບໍ່ມີການສະແດງຄວາມຄິດເຫัน</p>
          )}
        </div>

        {/* ຊ່ອງພິມຂໍ້ຄວາມ */}
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="ຂຽນຄຳຄິດເຫັນບ່ອນນີ້..."
          className="w-full h-[120px] p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all resize-none mb-4 text-[15px]"
        />
        
        <button 
          onClick={handlePostComment}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-[16px] shadow-sm"
        >
          Post Comment
        </button>
      </div>
    </div>
  );
}