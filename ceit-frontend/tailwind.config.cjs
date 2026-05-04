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
        primary: '#2563EB',
      }
    },
  },
  plugins: [],
}