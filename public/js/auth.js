document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameIn = document.getElementById('username').value;
    const passwordIn = document.getElementById('password').value;
    const btn = document.querySelector('button[type="submit"]');

    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Checking...';
    btn.disabled = true;

    try {
        // Gunakan URL relatif yang benar
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameIn, password: passwordIn })
        });

        // CEK 1: Jika server kasih error (seperti 405 atau 404)
        if (!response.ok) {
            const errorText = await response.text(); // Baca sebagai teks biasa dulu
            console.error("Server Error Response:", errorText);
            throw new Error(`Server Error (${response.status}). Cek _worker.js sudah ter-deploy.`);
        }

        // CEK 2: Baru coba parsing JSON
        const data = await response.json();

        if (data.status === "success") {
            localStorage.setItem('zepeto_token', data.token);
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('username', data.username);
            localStorage.setItem('user_role', data.role);

            // Link tanpa .html
            window.location.href = data.role === 'admin' ? '/admin/dashboard' : '/member/dashboard';
        } else {
            alert(data.error || 'Login Gagal');
            resetBtn();
        }

    } catch (err) {
        console.error("Auth Error:", err);
        alert(err.message);
        resetBtn();
    }

    function resetBtn() {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});