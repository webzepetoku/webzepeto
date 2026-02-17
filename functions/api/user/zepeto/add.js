export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const member_id = body.member_id || "2"; // Default ke ID 1

        // --- DATA RAHASIA (HARDCODED) ---
        const ACCESS_KEY = "CpFYXsUU2zasTep1S5wktWTwURYDgR3Tp5zut27gPykB";
        const SECRET_KEY = "MlxFrG8y4XqlUfQpdGDTsTDzt8LTRAIBTWEMMQHP1sRJrPhHsI0h1YTO7IM93Davez3+pjh57zMpnkEIV+OvoQ";

        // Kita bungkus jadi JSON rapi untuk disimpan
        // Script Python nanti akan membaca ini dari kolom 'cookie_string'
        const credentials = JSON.stringify({
            type: "openapi_jwt", 
            access_key: ACCESS_KEY,
            secret_key: SECRET_KEY
        });

        const zepeto_username = "Zepeto Studio API"; 

        // 1. HAPUS DATA LAMA (Biar tidak duplikat)
        await env.DB.prepare("DELETE FROM zepeto_accounts WHERE member_id = ?").bind(member_id).run();

        // 2. SIMPAN KUNCI KE DATABASE
        // Masukkan JSON credentials ke kolom cookie_string
        await env.DB.prepare(`
            INSERT INTO zepeto_accounts (member_id, zepeto_id, cookie_string, jwt_token, status)
            VALUES (?, ?, ?, 'jwt-mode', 'connected')
        `).bind(member_id, zepeto_username, credentials).run();

        return new Response(JSON.stringify({
            status: "success",
            message: "KUNCI BERHASIL DISIMPAN! Siap untuk Generate JWT di Python.",
            mode: "OpenAPI JWT"
        }), { 
            headers: { "Content-Type": "application/json" } 
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: "Gagal menyimpan Key: " + e.message }), { status: 500 });
    }
}