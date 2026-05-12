// src/index.ts
import app from '../app/server'

// Jika Anda nanti membuat fungsi cron terpisah, bisa diimpor di sini:
// import { processZepetoQueue } from './cron'

export default {
  // 1. MENANGKAP TRAFIK WEB & API (Dilempar ke HonoX)
  fetch: app.fetch,

  // 2. MENANGKAP JADWAL CRON JOB (Jalan di Background)
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    console.log("Menjalankan Auto-Publisher Zepeto...");
    
    // Gunakan ctx.waitUntil agar worker tidak mati sebelum proses antrian Zepeto selesai
    // ctx.waitUntil(processZepetoQueue(env));
  }
}
