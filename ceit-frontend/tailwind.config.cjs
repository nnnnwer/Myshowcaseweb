/** @type {import('tailwindcss').Config} */
export default {
  // บรรทัดนี้สำคัญมาก! ต้องมีเครื่องหมายดอกจันตามนี้เป๊ะๆ เพื่อให้มันหาไฟล์ .jsx ทุกโฟลเดอร์ใน src เจอ
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // 🌟 คงค่าสีเดิมของคุณไว้ใช้งานตามปกติ
      },
      // 🌟 เพิ่มการตั้งค่าฟอนต์ Saysetha OT เข้าไปในระบบร่วมกับสีเดิม
      fontFamily: {
        sans: ['Saysetha OT', 'sans-serif'], // เปลี่ยนฟอนต์ sans พื้นฐานของ Tailwind ทั้งเว็บให้เป็น Saysetha OT
        saysetha: ['Saysetha OT', 'sans-serif'], // เผื่อเอาไว้เรียกใช้เจาะจงผ่านคลาส className="font-saysetha"
      },
    },
  },
  plugins: [],
}