import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Clock, Globe } from 'lucide-react';

export default function SearchStats() {
  const [stats, setStats] = useState({ topKeywords: [], recentSearches: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/search-stats');
      setStats(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching search stats:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 text-[16px]">Loading statistics...</div>;

  // ล็อกให้แสดงผลสูงสุดเพียงแค่ 10 อันดับแรกเท่านั้นเพื่อความสวยงามและเป็นระเบียบ
  const topTenKeywords = stats.topKeywords.slice(0, 10);
  const recentTenSearches = stats.recentSearches.slice(0, 10);

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      {/* ส่วนหัวแดชบอร์ด */}
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="text-blue-600" size={32} />
        <h1 className="text-[28px] font-bold text-gray-900">ຫນ້າສະແດງຜົນການຄົ້ນຫາ</h1>
      </div>

      {/* ตารางแสดงผลแบ่งออกเป็น 2 คอลัมน์ฝั่งซ้ายและฝั่งขวา */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* คอลัมน์ฝั่งซ้าย: คำค้นหายอดนิยม จำกัดสูงสุด 10 อันดับ */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
            <Globe className="text-amber-500" size={20} />
            <h2 className="text-[18px] font-bold text-gray-800">ຄຳຄົ້ນຫາຍອດນິຍົມ (10 ອັນດັບ)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-[14px]">
                  <th className="pb-3 font-semibold">ອັນດັບ</th>
                  <th className="pb-3 font-semibold">ຫົວຂໍ້</th>
                  <th className="pb-3 font-semibold text-center">ຄັ້ງ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[15px] text-gray-700">
                {topTenKeywords.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 font-bold text-gray-400 w-16">#{index + 1}</td>
                    <td className="py-3 font-semibold text-blue-600">{item.keyword}</td>
                    <td className="py-3 text-center font-bold text-gray-900 bg-blue-50/40 rounded-lg w-24">
                      {item.total_searches} ຄັ້ງ
                    </td>
                  </tr>
                ))}
                {topTenKeywords.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-gray-400">ບໍ່ມີຄຳຄົ້ນຫາຍອດນິຍົມ</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* คอลัมน์ฝั่งขวา: ประวัติการค้นหาล่าสุด 10 รายการ */}
        {/* <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
            <Clock className="text-blue-500" size={20} />
            <h2 className="text-[18px] font-bold text-gray-800">ປະຫວັດການຄົ້ນຫາລ່າສຸດ</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-[14px]">
                  <th className="pb-3 font-semibold">ຫົວຂໍ້</th>
                  <th className="pb-3 font-semibold">User IP</th>
                  <th className="pb-3 font-semibold text-right">Date-Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[14px] text-gray-600">
                {recentTenSearches.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 font-semibold text-gray-800">{item.keyword}</td>
                    <td className="py-3 text-gray-400 font-mono text-[13px]">{item.ip_address}</td>
                    <td className="py-3 text-right text-gray-400">
                      {new Date(item.created_at).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </td>
                  </tr>
                ))}
                {recentTenSearches.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-gray-400">Do not have any recent search history</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div> */}

      </div>
    </div>
  );
}