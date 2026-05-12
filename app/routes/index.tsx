// app/routes/index.tsx
import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <div class="flex items-center justify-center h-screen relative">
      {/* Background Glow */}
      <div class="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,rgba(11,14,20,0)_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"></div>
      
      {/* Floating Orbs Animation */}
      <div class="absolute top-10 left-10 w-20 h-20 bg-purple-600/20 rounded-full blur-xl animate-bounce"></div>
      <div class="absolute bottom-20 right-20 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl animate-bounce" style="animation-delay: 2s"></div>

      {/* Login Card */}
      <div class="bg-[#151a23]/80 backdrop-blur-md border border-white/10 shadow-2xl w-full max-w-md p-8 rounded-2xl relative z-10">
        <div class="text-center mb-8">
          <div class="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <i class="fas fa-robot text-white text-xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-white tracking-wide">Zepeto<span class="text-purple-500">Auto</span></h1>
          <p class="text-gray-400 text-sm mt-2">Sign in to manage your automation</p>
        </div>

        <form id="loginForm" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Username</label>
            <div class="relative">
              <i class="fas fa-user absolute left-4 top-3.5 text-gray-500"></i>
              <input type="text" id="username" class="w-full bg-[#0b0e14]/60 border border-white/10 text-white py-3 pl-10 pr-4 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition" placeholder="Enter username" required />
            </div>
          </div>
          
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Password</label>
            <div class="relative">
              <i class="fas fa-lock absolute left-4 top-3.5 text-gray-500"></i>
              <input type="password" id="password" class="w-full bg-[#0b0e14]/60 border border-white/10 text-white py-3 pl-10 pr-4 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition" placeholder="Enter password" required />
            </div>
          </div>

          <button type="submit" class="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-900/30 transition transform hover:scale-[1.02] active:scale-[0.98]">
            Sign In <i class="fas fa-arrow-right ml-2 text-sm"></i>
          </button>
        </form>
      </div>

      {/* Script Login Handle Sisi Klien */}
      <script dangerouslySetInnerHTML={{__html: `
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const u = document.getElementById('username').value;
          const p = document.getElementById('password').value;
          const btn = e.target.querySelector('button');
          const oriBtnText = btn.innerHTML;
          
          btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Checking...';
          btn.disabled = true;
          
          try {
            const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({username: u, password: p})
            });
            const data = await res.json();
            
            if(res.ok && data.status === 'success') {
              localStorage.setItem('zepeto_token', data.token);
              localStorage.setItem('username', data.username);
              localStorage.setItem('user_role', data.role);
              localStorage.setItem('user_id', data.user_id);
              
              // Redirect berdasarkan Role
              window.location.href = data.role === 'admin' ? '/admin/dashboard' : '/member/dashboard';
            } else {
              alert(data.error || 'Login Gagal');
              btn.innerHTML = oriBtnText;
              btn.disabled = false;
            }
          } catch(err) {
            alert('Koneksi Error: ' + err.message);
            btn.innerHTML = oriBtnText;
            btn.disabled = false;
          }
        });
      `}} />
    </div>
  )
})
