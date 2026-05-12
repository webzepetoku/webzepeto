// app/islands/HistoryTable.tsx
import { useState, useEffect } from 'preact/hooks'

export default function HistoryTable() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRaw, setSelectedRaw] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const { data } = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Gagal load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // Auto-refresh setiap 10 detik agar user bisa melihat status berubah
    const interval = setInterval(fetchHistory, 10000); 
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING': return <span class="bg-yellow-900/40 text-yellow-400 px-2 py-1 rounded text-[10px] font-bold">IN QUEUE</span>;
      case 'PROCESSING': return <span class="bg-blue-900/40 text-blue-400 px-2 py-1 rounded text-[10px] font-bold"><i class="fas fa-spinner fa-spin mr-1"></i> UPLOADING</span>;
      case 'DONE': return <span class="bg-green-900/40 text-green-400 px-2 py-1 rounded text-[10px] font-bold">COMPLETED</span>;
      case 'FAILED': return <span class="bg-red-900/40 text-red-400 px-2 py-1 rounded text-[10px] font-bold">ERROR</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div class="glass-card p-6 overflow-hidden">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-white"><i class="fas fa-list-ul mr-2 text-purple-500"></i> Process Logs</h3>
        <button onClick={fetchHistory} class="text-xs text-gray-400 hover:text-white transition"><i class="fas fa-sync-alt mr-1"></i> Refresh</button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left zepeto-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Zepeto Account</th>
              <th>Filename</th>
              <th>Status</th>
              <th>Raw Output</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} class="text-center text-gray-500 py-10">Memuat data...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} class="text-center text-gray-500 py-10">Belum ada riwayat proses.</td></tr>
            ) : (
              logs.map(log => (
                <tr class="hover:bg-gray-800/30 transition">
                  <td class="text-gray-400 text-xs">{new Date(log.created_at).toLocaleString('id-ID')}</td>
                  <td class="text-white font-medium text-sm">@{log.zepeto_id}</td>
                  <td class="text-purple-400 text-sm">{log.filename}</td>
                  <td>{getStatusBadge(log.status)}</td>
                  <td>
                    {log.raw_response ? (
                      <button onClick={() => setSelectedRaw(log.raw_response)} class="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                        <i class="fas fa-code"></i> View Log
                      </button>
                    ) : <span class="text-gray-600 text-xs">...</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Raw Response */}
      {selectedRaw && (
        <div class="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
          <div class="glass-card w-full max-w-2xl bg-[#151A23] p-0 overflow-hidden flex flex-col max-h-[80vh]">
            <div class="flex justify-between items-center p-4 border-b border-gray-800 bg-[#0B0E14]">
              <h3 class="text-sm font-bold text-white"><i class="fas fa-terminal mr-2"></i> System Output</h3>
              <button onClick={() => setSelectedRaw(null)} class="text-gray-500 hover:text-white"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-4 overflow-y-auto flex-1">
              <pre class="bg-black/50 p-4 rounded-lg text-green-400 text-[11px] font-mono whitespace-pre-wrap break-words border border-gray-800">
                {selectedRaw}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
