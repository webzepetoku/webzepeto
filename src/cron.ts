// src/cron.ts

export async function processZepetoQueue(env: any) {
  const db = env.DB;
  const bucket = env.MY_BUCKET;

  console.log("[CRON] Memulai proses pengecekan antrian...");

  // 1. AMBIL 4 ANTRIAN TERATAS (Micro-Batching)
  // Kita melakukan JOIN untuk mengambil token Zepeto sekalian
  const { results: jobs } = await db.prepare(`
    SELECT uq.*, za.auth_token, za.cookie_string
    FROM upload_queue uq
    JOIN zepeto_accounts za ON uq.zepeto_account_id = za.id
    WHERE uq.status = 'PENDING'
    ORDER BY uq.created_at ASC
    LIMIT 4
  `).all();

  if (!jobs || jobs.length === 0) {
    console.log("[CRON] Antrian kosong. Beristirahat.");
    return;
  }

  // 2. KUNCI ANTRIAN (Ubah jadi PROCESSING agar tidak diambil cron berikutnya)
  const jobIds = jobs.map((j: any) => j.id);
  const placeholders = jobIds.map(() => '?').join(',');
  await db.prepare(`UPDATE upload_queue SET status = 'PROCESSING' WHERE id IN (${placeholders})`)
    .bind(...jobIds)
    .run();

  console.log(`[CRON] Memproses ${jobs.length} item secara paralel...`);

  // 3. EKSEKUSI PARALEL (Promise.all)
  await Promise.all(jobs.map(async (job: any) => {
    try {
      // Setup Kredensial (Di produksi, parse dari job.auth_token atau cookie_string)
      const AUTH_TOKEN = "eyJhbGciOi..."; // Ganti dengan logika parsing token asli Anda
      const headersBase = {
        "Authorization": `Bearer ${AUTH_TOKEN}`,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Origin": "https://studio.zepeto.me",
        "Referer": "https://studio.zepeto.me/"
      };

      // A. Ambil file biner dari R2 Storage
      const r2Object = await bucket.get(job.r2_file_key);
      if (!r2Object) throw new Error("File .zepeto hilang dari R2 Storage!");
      
      const fileBlob = new Blob([await r2Object.arrayBuffer()]);
      const formData = new FormData();
      formData.append("file", fileBlob, job.filename);

      // B. Upload File ke Zepeto
      const uploadRes = await fetch(`https://cf-api-studio.zepeto.me/api/assets?categoryId=${job.initial_category_id}`, {
        method: 'POST', headers: headersBase, body: formData
      });
      if (!uploadRes.ok) throw new Error(`[Upload API] ${await uploadRes.text()}`);
      
      const { id: assetId } = (await uploadRes.json()) as any;

      // C. Bypass Kategori (Trigger Render)
      await fetch(`https://cf-api-studio.zepeto.me/api/assets/${assetId}/build/${job.target_category_id}`, {
        method: 'POST', headers: { ...headersBase, "Content-Length": "0" }
      });

      // D. Smart Polling Render Status
      let isReady = false;
      for (let i = 0; i < 8; i++) {
        const checkRes = await fetch(`https://cf-api-studio.zepeto.me/api/assets/${assetId}`, {
          method: 'GET', headers: { ...headersBase, "Content-Type": "application/json" }
        });
        const checkData = (await checkRes.json()) as any;
        
        if (checkData.assetStatus === 'DONE' || checkData.assetStatus === 'SUCCESS') {
          isReady = true; break;
        } else if (checkData.assetStatus === 'FAILED') {
          throw new Error("[Render API] Ditolak oleh mesin Zepeto.");
        }
        await new Promise(r => setTimeout(r, 3000)); // Jeda 3 detik
      }

      if (!isReady) throw new Error("[Timeout] Mesin Zepeto terlalu lama merender.");

      // E. Create Item (Draft)
      // Ambil nama tanpa ekstensi dan batasi 30 karakter untuk Zepeto Name
      const cleanName = job.filename.split('.')[0].substring(0, 30);
      
      const itemRes = await fetch("https://cf-api-studio.zepeto.me/api/items", {
        method: "POST", headers: { ...headersBase, "Content-Type": "application/json" },
        body: JSON.stringify({
          price: job.price || 9,
          name: cleanName,
          promotional: false,
          assetId: assetId,
          categoryId: job.target_category_id,
          currency: "ZEM"
        })
      });

      const rawResponse = await itemRes.text();

      // F. Sukses! Catat ke Database
      await db.prepare(`UPDATE upload_queue SET status = 'DONE', raw_response = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?`)
        .bind(rawResponse, job.id).run();

    } catch (err: any) {
      // Gagal! Catat errornya ke Database
      await db.prepare(`UPDATE upload_queue SET status = 'FAILED', raw_response = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?`)
        .bind(err.message, job.id).run();
    } finally {
      // H. SELALU HAPUS FILE DARI R2 (Clean up / Hemat Storage)
      await bucket.delete(job.r2_file_key);
    }
  }));

  console.log(`[CRON] Selesai memproses batch.`);
}
