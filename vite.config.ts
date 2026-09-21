import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: 리포 이름이 `Paaaaak.github.io`가 아니라면
// base를 '/<repo-name>/' 으로 바꿔주세요. (예: '/portfolio/')
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
})
