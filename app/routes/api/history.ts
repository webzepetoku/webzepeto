// app/routes/api/history.ts
import { createRoute } from 'honox/factory'

export const GET = createRoute(async (c) => {
  const db = c.env.DB;
  const memberId = 2; // TODO: Dinamis dari Middleware JWT (misal: c.get('user').id)

  try {
    // Ambil log yang diurutkan dari terbaru (LIMIT 50 untuk performa)
    const { results } = await db.prepare(`
      SELECT uq.id, uq.filename, uq.status, uq.raw_response, uq.created_at, za.zepeto_id 
      FROM upload_queue uq
      JOIN zepeto_accounts za ON uq.zepeto_account_id = za.id
      WHERE uq.user_id = ?
      ORDER BY uq.created_at DESC
      LIMIT 50
    `).bind(memberId).all();

    return c.json({ status: 'success', data: results });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
})
