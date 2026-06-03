import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // ถ้ามีแค่หน้าเดียว หรือไม่มีหน้าเลย ไม่ต้องแสดงแถบ Pagination
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-gray-100">
      {/* ปุ่มย้อนกลับ (Previous) */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-[14px] font-bold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
      >
        <ChevronLeft size={16} /> Previous
      </button>

      {/* ข้อความบอกตำแหน่งหน้า */}
      <span className="text-[15px] font-bold text-gray-500">
        Page <span className="text-gray-900">{currentPage}</span> of {totalPages}
      </span>

      {/* ปุ่มถัดไป (Next) */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-[14px] font-bold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}