// app/routes/member/dashboard.tsx
import { createRoute } from 'honox/factory'
import DashboardStats from '../../islands/DashboardStats'

export default createRoute((c) => {
  return c.render(
    <>
      <header class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-100">
            Dashboard <span class="text-purple-500">Overview</span>
          </h2>
        </div>
      </header>

      {/* Memanggil Komponen Island Statistik */}
      <DashboardStats />

      <h3 class="text-xl font-bold mb-5 flex items-center gap-2">
        <i class="fas fa-sparkles text-purple-400"></i> Latest Updates
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="glass-card p-6 hover:border-purple-500/50 transition duration-300">
          <h4 class="font-bold text-lg text-purple-300">Auto Bypass System</h4>
          <p class="text-sm text-gray-400 mt-2 leading-relaxed">
            Bypass polygon limit and optimize your Zepeto assets automatically.
          </p>
        </div>
      </div>
    </>
  )
})
