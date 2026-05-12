// app/server.ts
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'

// Inisialisasi Hono app
const app = new Hono()

// Middleware Global
app.use('*', logger())          // Mencatat semua traffic yang masuk
app.use('*', secureHeaders())   // Menambahkan header keamanan dasar

// Catatan:
// HonoX akan otomatis menyusuri folder `app/routes/` 
// dan mendaftarkan URL (File-based Routing) tanpa perlu kita tulis manual di sini.

export default app
