export async function onRequestPost(context) {
    const { request, env } = context;
    const trxId = `TRX-${crypto.randomUUID()}`;

    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const zepetoAccountId = formData.get('zepeto_account_id');
        const category = formData.get('category');
        const memberId = formData.get('member_id');

        // 1. Ambil Config dari DB
        const config = await env.DB.prepare(`
            SELECT uc.*, za.cookie_string, za.zepeto_id 
            FROM user_configs uc
            JOIN zepeto_accounts za ON uc.member_id = za.member_id
            WHERE uc.member_id = ? AND za.id = ?
        `).bind(memberId, zepetoAccountId).first();

        if (!config) throw new Error("Config tidak ditemukan");

        // 2. Log awal ke Antrean
        await env.DB.prepare(`
            INSERT INTO upload_queue (transaction_uuid, member_id, zepeto_account_id, zepeto_id, filename, status)
            VALUES (?, ?, ?, ?, ?, 'processing')
        `).bind(trxId, memberId, zepetoAccountId, config.zepeto_id, file.name).run();

        // 3. STEP 1: Upload ke Drive (via Direct Fetch)
        // Catatan: Token auth harus dihandle atau menggunakan API Key/Service Account logic
        // Di sini kita asumsikan integrasi fetch murni ke GDrive API
        const driveRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`, {
            method: 'POST',
            body: formData // Sesuaikan dengan struktur multipart GDrive
        });

        // 4. STEP 2: Trigger Hugging Face
        const hfRes = await fetch(env.HF_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                process_id: trxId,
                file_name: file.name,
                category: category
            })
        });
        const hfData = await hfRes.json();

        // 5. STEP 3: Final Update
        await env.DB.prepare(`
            UPDATE upload_queue SET status = 'completed', zepeto_content_id = ? WHERE transaction_uuid = ?
        `).bind(hfData.content_id || 'manual-check', trxId).run();

        return new Response(JSON.stringify({ status: "success", trxId }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}