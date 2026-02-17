export async function onRequestGet(context) {
    const { env } = context;
    try {
        const members = await env.DB.prepare("SELECT COUNT(*) as count FROM members").first();
        const accounts = await env.DB.prepare("SELECT COUNT(*) as count FROM zepeto_accounts").first();
        const uploads = await env.DB.prepare("SELECT COUNT(*) as count FROM upload_queue WHERE status = 'completed'").first();

        return new Response(JSON.stringify({
            total_members: members.count,
            total_zepeto_accounts: accounts.count,
            total_files_processed: uploads.count
        }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}