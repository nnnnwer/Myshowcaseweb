import { Star } from 'lucide-react';

export default function FilterBar({ onFilterChange, activeFilters }) {
  
  // 🌟 ฟังก์ชันคำนวณช่วงปีการศึกษา (ย้อนหลัง 20 ปี และ ล่วงหน้า 10 ปี)
  const generateYearOptions = () => {
    const currentYear = 2026; 
    const years = [];
    for (let y = currentYear + 10; y > currentYear; y--) {
      years.push(`${y - 1}-${y}`);
    }
    for (let y = currentYear; y >= currentYear - 20; y--) {
      years.push(`${y - 1}-${y}`);
    }
    return years;
  };

  const yearOptions = generateYearOptions();

  return (
    <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center justify-between">
      
      {/* กลุ่มปุ่มเรียงลำดับข้อมูล และ เลือกปีการศึกษา */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* ปุ่ม คะแนนสูงสุด */}
        <button
          onClick={() => onFilterChange('sort', activeFilters.sort === 'top_rated' ? '' : 'top_rated')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-sm ${
            activeFilters.sort === 'top_rated'
              ? 'bg-blue-600 text-white ring-2 ring-blue-300'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <Star size={16} fill={activeFilters.sort === 'top_rated' ? '#FFF' : 'none'} />
          ຄະແນນສູງສຸດ
        </button>

        {/* Dropdown เลือกปีการศึกษา */}
        <div className="relative flex items-center">
          <select
            value={activeFilters.project_year || ''}
            onChange={(e) => onFilterChange('project_year', e.target.value)}
            className="appearance-none bg-blue-500 text-white hover:bg-blue-600 pl-5 pr-10 py-2.5 rounded-xl text-[14px] font-bold border-none shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
          >
            <option value="" className="bg-white text-gray-700"> ເລືອກປີການສຶກສາ</option>
            {yearOptions.map((year) => (
              <option key={year} value={year} className="bg-white text-gray-700 font-mono">
                {year}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 text-white text-[10px]">
            ▼
          </div>
        </div>

        {/* 🌟 1. เปลี่ยนปุ่ม Category (Database, Network, Animation) ให้เป็นปุ่มเลื่อนลง (Dropdown) สีฟ้า-ขาว */}
        <div className="relative flex items-center">
          <select
            value={activeFilters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="appearance-none bg-blue-500 text-white hover:bg-blue-600 pl-5 pr-10 py-2.5 rounded-xl text-[14px] font-bold border-none shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
          >
            <option value="" className="bg-white text-gray-700"> ເລືອກໝວດໝູ່ບົດວິໄຈ</option>
            <option value="database" className="bg-white text-gray-700">Database</option>
            <option value="network" className="bg-white text-gray-700">Network</option>
            <option value="animation" className="bg-white text-gray-700">Animation</option>
            <option value="iot" className="bg-white text-gray-700">IOT</option>
          </select>
          <div className="pointer-events-none absolute right-3 text-white text-[10px]">
            ▼
          </div>
        </div>
      </div>

      {/* กลุ่มปุ่มกรองข้อมูลด้านขวา (สาขา และ ช่วงเวลา) */}
      <div className="flex flex-wrap gap-3 items-center">
        
        {/* ตัวเลือกกรองตามสาขา (Major) */}
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => onFilterChange('major', activeFilters.major === 'CE' ? '' : 'CE')}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
              activeFilters.major === 'CE' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ວິສະວະກຳຄອມພິວເຕີ (CE)
          </button>
          <button
            onClick={() => onFilterChange('major', activeFilters.major === 'IT' ? '' : 'IT')}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
              activeFilters.major === 'IT' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ເຕັກໂນໂລຊີຂໍ້ມູນຂ່າວສານ (IT)
          </button>
        </div>

        {/* ตัวเลือกกรองตามช่วงเวลา (Timeframe) */}
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => onFilterChange('time', activeFilters.time === 'week' ? '' : 'week')}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
              activeFilters.time === 'week' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ອາທິດນີ້
          </button>
          <button
            onClick={() => onFilterChange('time', activeFilters.time === 'month' ? '' : 'month')}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
              activeFilters.time === 'month' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ເດືອນນີ້
          </button>
        </div>

      </div>
    </div>
  );
}