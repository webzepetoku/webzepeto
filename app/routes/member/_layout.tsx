// app/routes/member/_layout.tsx
import { jsxRenderer } from 'hono/jsx-renderer'
import { Sidebar } from '../../components/Sidebar'

export default jsxRenderer(({ children }, c) => {
  // Dalam implementasi nyata, nilai ini diambil dari dekode JWT/Cookie Auth Anda
  const username = "Member01"; 
  const role = "member";
  
  // Mendapatkan path URL saat ini untuk menyorot (highlight) menu aktif di Sidebar
  const activePath = new URL(c.req.url).pathname;

  return (
    <div class="flex h-screen w-full bg-[#0B0E14] overflow-hidden">
      {/* Sidebar disuntikkan di sini */}
      <Sidebar role={role} activePath={activePath} username={username} />
      
      {/* Konten Halaman Utama (Dashboard, Accounts, Upload, dll) */}
      <main class="flex-1 overflow-y-auto p-4 md:p-8 relative">
        {children}
      </main>
    </div>
  )
})
