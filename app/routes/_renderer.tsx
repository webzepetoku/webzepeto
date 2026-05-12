// app/routes/_renderer.tsx
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'

// Setup Konfigurasi Tailwind Custom seperti milik Bos
const tailwindConfig = `
  tailwind.config = {
    theme: {
      extend: { 
        colors: { 
          dark: '#0B0E14', 
          card: '#151A23', 
          accent: '#a855f7',
          zepeto: '#5C46FF'
        } 
      }
    }
  }
`;

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ?? 'ZepetoAuto - Automation'}</title>
        
        {/* Inject Tailwind via CDN untuk keringanan Serverless */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: tailwindConfig }}></script>
        
        {/* Font Awesome untuk Icon */}
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
        
        {/* Custom Styling Dasar */}
        <style dangerouslySetInnerHTML={{ __html: `
          body { background-color: #0B0E14; color: #e2e8f0; font-family: 'Inter', sans-serif; }
          .glass-card { background: #151A23; border: 1px solid #2d3748; border-radius: 12px; }
          .zepeto-table th { background-color: #0B0E14; color: #99999C; font-size: 13px; padding: 12px 16px; border-bottom: 1px solid #2d3748; }
          .zepeto-table td { padding: 16px; border-bottom: 1px solid rgba(45, 55, 72, 0.5); }
        `}} />

        {/* Script Client-side untuk HonoX Islands */}
        <Script src="/app/client.ts" async />
      </head>
      
      {/* "children" di sini akan otomatis digantikan oleh konten dari halaman (route) yang sedang diakses user */}
      <body class="flex h-screen overflow-hidden">
        {children}
      </body>
    </html>
  )
})
