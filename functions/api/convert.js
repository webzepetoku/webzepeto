export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { file_id, filename, member_id, zepeto_account_id } = body;

        // 1. AMBIL CONFIG GOOGLE DRIVE (Dari user_configs)
        const config = await env.DB.prepare(
            "SELECT service_account_json, zepeto_root_folder_id FROM user_configs WHERE member_id = ?"
        ).bind(member_id).first();

        // 2. AMBIL KUNCI ZEPETO (Dari zepeto_accounts berdasarkan pilihan dropdown)
        const zepeto = await env.DB.prepare(
            "SELECT zepeto_id, cookie_string FROM zepeto_accounts WHERE id = ? AND member_id = ?"
        ).bind(zepeto_account_id, member_id).first();

        if (!config || !zepeto) {
            return new Response(JSON.stringify({ error: "Data Config atau Akun Zepeto tidak ditemukan!" }), { status: 404 });
        }

        // 3. CATAT DI UPLOAD_QUEUE (Agar history muncul)
        const transaction_uuid = crypto.randomUUID();
        await env.DB.prepare(`
            INSERT INTO upload_queue (transaction_uuid, member_id, zepeto_account_id, zepeto_id, filename, fbx_drive_id, status)
            VALUES (?, ?, ?, ?, ?, ?, 'processing')
        `).bind(transaction_uuid, member_id, zepeto_account_id, zepeto.zepeto_id, filename, file_id).run();

        // 4. SIAPKAN PAYLOAD LENGKAP UNTUK HUGGING FACE
        const pythonPayload = {
            transaction_id: transaction_uuid,
            file_id: file_id,
            folder_id: config.zepeto_root_folder_id,
            filename: filename,
            google_creds: JSON.parse(config.service_account_json),
            zepeto_keys: JSON.parse(zepeto.cookie_string) // {access_key, secret_key}
        };

        // 5. KIRIM KE HUGGING FACE (URL dari Env Variable)
        const hfResponse = await fetch(env.HF_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pythonPayload)
        });

        const hfResult = await hfResponse.json();

        return new Response(JSON.stringify({
            status: "success",
            message: "Tugas sedang diproses di server konversi",
            transaction_id: transaction_uuid
        }), { headers: { "Content-Type": "application/json" } });

    } catch (e) {
        return new Response(JSON.stringify({ error: "Bridge Error: " + e.message }), { status: 500 });
    }
}