// app/routes/api/zepeto/accounts.ts
import { createRoute } from 'honox/factory'

// GET: Mengambil daftar akun Zepeto milik member
export const GET = createRoute(async (c) => {
  const db = c.env.DB;
  const memberId = 2; // TODO: Ambil dari session JWT

  try {
    const { results } = await db.prepare(
      "SELECT id, zepeto_id, status FROM zepeto_accounts WHERE member_id = ?"
    ).bind(memberId).all();

    return c.json(results);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
})

// POST: Menambah akun Zepeto (Skenario Auto Login / Save Creds)
export const POST = createRoute(async (c) => {
  const db = c.env.DB;
  const memberId = 2; // TODO: Ambil dari session JWT
  
  try {
    const body = await c.req.parseBody();
    const zepetoId = body['zepeto_id'] as string;
    const password = body['password'] as string; // Di dunia nyata ini dipakai untuk cURL login

    // Simulasi Login Sukses:
    // Disini idealnya Anda menembak API login Zepeto untuk mendapat token asli.
    // Sementara kita simpan mock credentials ke kolom cookie_string
    const mockCredentials = JSON.stringify({ 
      type: "openapi_jwt", 
      access_key: "KUNCI_DUMMY", 
      secret_key: "KUNCI_RAHASIA" 
    });

    await db.prepare(`
      INSERT INTO zepeto_accounts (member_id, zepeto_id, jwt_token, cookie_string, status)
      VALUES (?, ?, 'jwt-mode', ?, 'active')
    `).bind(memberId, zepetoId, mockCredentials).run();

    return c.json({ status: "success", zepeto_id: zepetoId });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
})

// DELETE: Menghapus akun
export const DELETE = createRoute(async (c) => {
  const db = c.env.DB;
  const accountId = c.req.query('id'); // Menangkap /api/zepeto/accounts?id=...

  if (!accountId) return c.json({ error: "ID tidak valid" }, 400);

  try {
    await db.prepare("DELETE FROM zepeto_accounts WHERE id = ?").bind(accountId).run();
    return c.json({ status: "success" });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
})
