// app/islands/AccountManager.tsx
import { useState, useEffect } from 'preact/hooks'

export default function AccountManager() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formZepetoId, setFormZepetoId] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/zepeto/accounts');
      if (res.ok) {
        const data = await res.json();
        setAccounts(data);
      }
    } catch (err) {
      console.error("Gagal memuat akun:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleConnect = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/zepeto/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zepeto_id: formZepetoId, password: formPassword })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Akun berhasil dihubungkan!");
        setShowModal(false);
        fetchAccounts(); // Refresh daftar akun
      } else {
        alert(data.error || "Gagal menghubungkan akun.");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus akun ini dari database? Token akan hilang.')) return;
    try {
      const res = await fetch(`/api/zepeto/delete/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAccounts();
    } catch (err) {
      alert("Gagal menghapus akun.");
    }
  };

  return (
    <>
      <header class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-white">Zepeto <span class="text-purple-500">Accounts</span></h2>
          <p class="text-gray-400 text-xs md:text-sm mt-1">Manage connected accounts for automation.</p>
        </div>
        <button onClick={() => setShowModal(true)} class="bg-[#5C46FF] hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition">
          <i class="fas fa-plus"></i> <span class="hidden sm:inline">Connect Account</span>
        </button>
      </header>

      {/* Grid Akun */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div class="col-span-full py-20 text-center text-gray-500">
            <i class="fas fa-circle-notch fa-spin text-3xl mb-4"></i><p>Fetching accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div class="col-span-full py-10 flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-800 rounded-xl">
            <i class="fas fa-ghost text-4xl mb-3 opacity-50"></i>
            <p class="text-sm">No accounts linked yet.</p>
          </div>
        ) : (
          accounts.map(acc => (
            <div class={`glass-card p-5 relative ${acc.status !== 'active' ? 'opacity-70 border-red-900/30' : ''}`}>
              <div class="absolute top-4 right-4 flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-gray-700">
                <span class={`w-2.5 h-2.5 rounded-full ${acc.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></span>
                <span class={`text-[10px] font-bold ${acc.status === 'active' ? 'text-green-400' : 'text-red-400'} tracking-wider`}>
                  {acc.status.toUpperCase()}
                </span>
              </div>
              <div class="flex items-center gap-4 mb-5 pt-4">
                <div class="w-14 h-14 rounded-xl border border-gray-700 bg-purple-900/20 flex items-center justify-center text-xl font-bold text-purple-400">
                  {acc.zepeto_id.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 class="font-bold text-white text-lg truncate w-32" title={acc.zepeto_id}>{acc.zepeto_id}</h3>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-xs py-2 rounded-lg border border-gray-700 transition">
                  <i class="fas fa-sync-alt mr-1"></i> Sync
                </button>
                <button onClick={() => handleDelete(acc.id)} class="w-10 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/30 rounded-lg transition flex justify-center items-center">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add Account */}
      {showModal && (
        <div class="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
          <div class="glass-card w-full max-w-md p-6 bg-[#151A23]">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-white">Connect Zepeto</h3>
              <button onClick={() => setShowModal(false)} class="text-gray-500 hover:text-white"><i class="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleConnect} class="space-y-4">
              <div>
                <label class="text-xs text-gray-500 uppercase font-bold">Email / Phone / Username</label>
                <input type="text" value={formZepetoId} onInput={(e: any) => setFormZepetoId(e.target.value)} class="w-full bg-[#0b0e14] border border-gray-700 p-3 rounded-lg text-white mt-1 focus:border-[#5C46FF] outline-none" required />
              </div>
              <div>
                <label class="text-xs text-gray-500 uppercase font-bold">Password</label>
                <input type="password" value={formPassword} onInput={(e: any) => setFormPassword(e.target.value)} class="w-full bg-[#0b0e14] border border-gray-700 p-3 rounded-lg text-white mt-1 focus:border-[#5C46FF] outline-none" required />
              </div>
              <button type="submit" disabled={isSubmitting} class="w-full bg-[#5C46FF] hover:bg-indigo-600 py-3 rounded-lg font-bold text-white transition mt-4">
                {isSubmitting ? <><i class="fas fa-spinner fa-spin"></i> Connecting...</> : "Connect Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
