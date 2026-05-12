// app/islands/DashboardStats.tsx
import { useState, useEffect } from 'preact/hooks'

export default function DashboardStats() {
  const [stats, setStats] = useState({ accounts: 0, active: 0, uploads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fungsi untuk mengambil data statistik dari API Cloudflare Worker
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('zepeto_token') || '';
        const userId = localStorage.getItem('user_id') || '2'; // Dummy fallback
        const headers = { 'Authorization': token };

        // Panggil endpoint API (sesuai file yang Anda sediakan)
        const [accRes, histRes] = await Promise.all([
          fetch(`/api/user/zepeto-accounts?member_id=${userId}`, { headers }),
          // Asumsi Anda memiliki endpoint history
          // fetch(`/api/user/history?member_id=${userId}`, { headers })
        ]);

        const accounts = accRes.ok ? await accRes.json() : [];
        const history = []; // histRes.ok ? await histRes.json() : [];

        setStats({
          accounts: accounts.length || 0,
          active: accounts.filter((a: any) => a.status === 'active' || a.status === 'connected').length || 0,
          uploads: history.filter((h: any) => h.status === 'completed').length || 0
        });
      } catch (err) {
        console.error("Gagal memuat statistik", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div class="text-gray-500 animate-pulse"><i class="fas fa-circle-notch fa-spin mr-2"></i> Memuat statistik...</div>;
  }

  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      <div class="glass-card p-6 flex items-center relative overflow-hidden group">
        <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
          <i class="fas fa-users text-6xl text-purple-500"></i>
        </div>
        <div class="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center mr-4">
          <i class="fas fa-user-friends text-purple-400 text-xl"></i>
        </div>
        <div>
          <p class="text-gray-400 text-sm">Linked Accounts</p>
          <p class="text-2xl font-bold text-white mt-1">{stats.accounts}</p>
        </div>
      </div>

      <div class="glass-card p-6 flex items-center relative overflow-hidden group">
        <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
          <i class="fas fa-bolt text-6xl text-blue-500"></i>
        </div>
        <div class="w-12 h-12 rounded-lg bg-blue-900/30 flex items-center justify-center mr-4">
          <i class="fas fa-check-circle text-blue-400 text-xl"></i>
        </div>
        <div>
          <p class="text-gray-400 text-sm">Active Sessions</p>
          <p class="text-2xl font-bold text-white mt-1">{stats.active}</p>
        </div>
      </div>

      <div class="glass-card p-6 flex items-center relative overflow-hidden group sm:col-span-2 lg:col-span-1">
        <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
          <i class="fas fa-file-archive text-6xl text-green-500"></i>
        </div>
        <div class="w-12 h-12 rounded-lg bg-green-900/30 flex items-center justify-center mr-4">
          <i class="fas fa-box-open text-green-400 text-xl"></i>
        </div>
        <div>
          <p class="text-gray-400 text-sm">Total Uploaded</p>
          <p class="text-2xl font-bold text-white mt-1">{stats.uploads}</p>
        </div>
      </div>
    </div>
  );
}
