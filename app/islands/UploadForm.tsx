// app/islands/UploadForm.tsx
import { useState, useEffect } from 'preact/hooks'
import { ZEPETO_CATEGORIES } from '../../src/constants/zepeto' // Konstanta dari Batch sebelumnya

export default function UploadForm() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [targetCategory, setTargetCategory] = useState(ZEPETO_CATEGORIES[0].id);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isUploading, setIsUploading] = useState(false);

  // Ambil daftar akun milik user untuk diisi ke dropdown
  useEffect(() => {
    fetch('/api/zepeto/accounts')
      .then(res => res.json())
      .then(data => setAccounts(data))
      .catch(() => console.error("Gagal load akun"));
  }, []);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!file || !selectedAccount) return alert("Pilih akun dan file!");

    setIsUploading(true);
    setStatus({ type: 'info', message: 'Mengamankan file ke R2 Cloudflare...' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('zepeto_account_id', selectedAccount);
    formData.append('target_category_id', targetCategory);
    // initial_category akan di-handle otomatis oleh backend API

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: `Berhasil! Job ID: ${data.jobId} masuk ke antrian.` });
        setFile(null); // Reset file
      } else {
        setStatus({ type: 'error', message: data.error || 'Gagal Upload.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Koneksi terputus saat upload.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div class="glass-card p-6 md:p-8 max-w-2xl mx-auto mt-6">
      <div class="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
        <i class="fas fa-cloud-upload-alt text-2xl text-purple-500"></i>
        <h2 class="text-2xl font-bold text-white">Smart Upload Queue</h2>
      </div>

      <form onSubmit={handleSubmit} class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Pilih Akun Zepeto</label>
          <select value={selectedAccount} onChange={(e: any) => setSelectedAccount(e.target.value)} class="w-full bg-[#0B0E14] border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-[#5C46FF]" required>
            <option value="" disabled>-- Pilih Akun --</option>
            {accounts.map(acc => (
              <option value={acc.id}>{acc.zepeto_id}</option>
            ))}
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Kategori Target (Bypass)</label>
          <select value={targetCategory} onChange={(e: any) => setTargetCategory(e.target.value)} class="w-full bg-[#0B0E14] border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-[#5C46FF]">
            {ZEPETO_CATEGORIES.map(cat => (
              <option value={cat.id}>{cat.label}</option>
            ))}
          </select>
          <p class="text-[10px] text-gray-500 mt-1"><i class="fas fa-info-circle"></i> Sistem akan mem-bypass poligon menggunakan initial category Body/Figure.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase mb-2">File .zepeto</label>
          <input type="file" accept=".zepeto" onChange={(e: any) => setFile(e.target.files[0])} class="w-full bg-[#0B0E14] border border-gray-700 text-gray-400 p-2.5 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-900/30 file:text-purple-400 hover:file:bg-purple-900/50" required />
        </div>

        <button type="submit" disabled={isUploading} class={`w-full py-3 rounded-lg font-bold text-white transition ${isUploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#5C46FF] hover:bg-indigo-600'}`}>
          {isUploading ? <><i class="fas fa-circle-notch fa-spin mr-2"></i> Mengunggah...</> : <><i class="fas fa-paper-plane mr-2"></i> Kirim ke Antrian Bot</>}
        </button>

        {status.message && (
          <div class={`p-4 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-900/50' : status.type === 'error' ? 'bg-red-900/20 text-red-400 border border-red-900/50' : 'bg-blue-900/20 text-blue-400 border border-blue-900/50'}`}>
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
}
