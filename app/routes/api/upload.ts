// app/routes/api/upload.ts
import { createRoute } from 'honox/factory'

export const POST = createRoute(async (c) => {
  const db = c.env.DB;
  const bucket = c.env.MY_BUCKET;
  
  try {
    const body = await c.req.parseBody();
    const file = body['file'] as File;
    const accountId = body['zepeto_account_id'] as string;
    const targetCategory = body['target_category_id'] as string;
    
    // TODO: Di produksi, ambil member_id dari JWT/Session Middleware
    // Untuk saat ini kita *hardcode* ke member_id = 2 (member01) sesuai seed.sql Anda
    const memberId = 2; 
    
    if (!file || !accountId || !targetCategory) {
      return c.json({ error: "Data formulir tidak lengkap!" }, 400);
    }

    // 1. Buat UUID Transaksi (Sangat Aman dari Bentrokan)
    const transactionUuid = crypto.randomUUID();
    const r2FileName = `${transactionUuid}.zepeto`;

    // 2. Simpan File ke Brankas R2 (Tanpa Public URL)
    await bucket.put(r2FileName, await file.arrayBuffer());

    // 3. Catat di Database D1 sebagai Antrian (PENDING)
    // Sesuai dengan skema tabel upload_queue yang kita modifikasi untuk Bypass
    await db.prepare(`
      INSERT INTO upload_queue 
      (transaction_uuid, member_id, zepeto_account_id, filename, r2_file_key, initial_category_id, target_category_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')
    `).bind(
      transactionUuid,
      memberId,
      accountId,
      file.name,           // Nama asli sekadar untuk log history user
      r2FileName,          // Kunci mengambil file di R2
      '61e4d3623ce92b0efe1cc21f', // Default Pancingan Awal: Body/Figure
      targetCategory
    ).run();

    return c.json({ 
      status: 'success', 
      jobId: transactionUuid,
      message: 'File berhasil diamankan ke R2 dan masuk antrian.' 
    });

  } catch (err: any) {
    console.error("API Upload Error:", err);
    return c.json({ error: `Terjadi kesalahan server: ${err.message}` }, 500);
  }
})
