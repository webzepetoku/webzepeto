export async function onRequestPost(context) {
    const { request, env } = context;
    try {
        const { username, password } = await request.json();
        
        const user = await env.DB.prepare(
            "SELECT id, username, role FROM members WHERE username = ? AND password = ?"
        ).bind(username, password).first();

        if (!user) {
            return new Response(JSON.stringify({ error: "Username atau Password salah!" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        const token = btoa(`${user.id}_${user.role}_${Date.now()}`);

        return new Response(JSON.stringify({
            status: "success",
            token,
            user_id: user.id,
            username: user.username,
            role: user.role
        }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}