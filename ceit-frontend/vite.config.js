import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ไม่ต้อง import tailwindcss ที่นี่แล้วสำหรับ v3 (เพราะ v3 จะรันผ่าน postcss.config.cjs แทน)
export default defineConfig({
  plugins: [react()],
})