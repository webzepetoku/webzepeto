// app/routes/member/upload.tsx
import { createRoute } from 'honox/factory'
import UploadForm from '../../islands/UploadForm'

export default createRoute((c) => {
  return c.render(
    <>
      <header class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-white">
            Upload <span class="text-purple-500">Assets</span>
          </h2>
          <p class="text-gray-400 text-xs md:text-sm mt-1">
            Unggah file .zepeto Anda ke R2 untuk diproses oleh Bot.
          </p>
        </div>
      </header>

      {/* Memanggil komponen interaktif form upload */}
      <UploadForm />
    </>
  )
})
