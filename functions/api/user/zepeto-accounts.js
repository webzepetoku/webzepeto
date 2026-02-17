export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const memberId = url.searchParams.get("member_id");

    try {
        const { results } = await env.DB.prepare(
            "SELECT id, zepeto_id, status FROM zepeto_accounts WHERE member_id = ?"
        ).bind(memberId).all();

        return new Response(JSON.stringify(results), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}