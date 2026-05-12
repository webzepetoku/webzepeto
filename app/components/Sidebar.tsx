// app/components/Sidebar.tsx
import type { FC } from 'hono/jsx'

interface SidebarProps {
  role: 'admin' | 'member';
  activePath: string;
  username: string;
}

export const Sidebar: FC<SidebarProps> = ({ role, activePath, username }) => {
  const isMember = role === 'member';
  
  return (
    <aside class="w-64 bg-[#0B0E14] border-r border-gray-800 flex-shrink-0 flex flex-col justify-between p-5">
      <div>
        <div class="flex items-center gap-3 mb-10 px-2">
          <div class={`w-8 h-8 rounded-lg flex items-center justify-center ${isMember ? 'bg-purple-600' : 'bg-red-600'}`}>
            <i class="fas fa-robot text-white"></i>
          </div>
          <h1 class="font-bold text-xl tracking-wide text-white">
            {isMember ? 'Zepeto' : 'ADMIN'}<span class={isMember ? "text-purple-500" : "text-red-500"}>{isMember ? 'Auto' : 'Panel'}</span>
          </h1>
        </div>

        <nav class="space-y-1">
          {isMember ? (
            <>
              <a href="/member/dashboard" class={`flex items-center p-3 text-sm font-medium rounded-lg transition ${activePath === '/member/dashboard' ? 'bg-purple-900/20 text-purple-400 border-l-2 border-purple-500' : 'text-gray-400 hover:bg-gray-800'}`}>
                <i class="fas fa-th-large w-6"></i> Dashboard
              </a>
              <a href="/member/accounts" class={`flex items-center p-3 text-sm font-medium rounded-lg transition ${activePath === '/member/accounts' ? 'bg-purple-900/20 text-purple-400 border-l-2 border-purple-500' : 'text-gray-400 hover:bg-gray-800'}`}>
                <i class="fas fa-users w-6"></i> Zepeto Accounts
              </a>
              <a href="/member/upload" class={`flex items-center p-3 text-sm font-medium rounded-lg transition ${activePath === '/member/upload' ? 'bg-purple-900/20 text-purple-400 border-l-2 border-purple-500' : 'text-gray-400 hover:bg-gray-800'}`}>
                <i class="fas fa-cloud-upload-alt w-6"></i> Upload Assets
              </a>
              <a href="/member/history" class={`flex items-center p-3 text-sm font-medium rounded-lg transition ${activePath === '/member/history' ? 'bg-purple-900/20 text-purple-400 border-l-2 border-purple-500' : 'text-gray-400 hover:bg-gray-800'}`}>
                <i class="fas fa-history w-6"></i> History Log
              </a>
              <a href="/member/settings" class={`flex items-center p-3 text-sm font-medium rounded-lg transition ${activePath === '/member/settings' ? 'bg-purple-900/20 text-purple-400 border-l-2 border-purple-500' : 'text-gray-400 hover:bg-gray-800'}`}>
                <i class="fas fa-cog w-6"></i> Settings
              </a>
            </>
          ) : (
            <>
              <a href="/admin/dashboard" class={`flex items-center p-3 text-sm font-medium rounded-lg transition ${activePath === '/admin/dashboard' ? 'bg-red-900/20 text-red-400 border-l-2 border-red-500' : 'text-gray-400 hover:bg-gray-800'}`}>
                <i class="fas fa-chart-line w-6"></i> Statistics
              </a>
              <a href="/admin/members" class={`flex items-center p-3 text-sm font-medium rounded-lg transition ${activePath === '/admin/members' ? 'bg-red-900/20 text-red-400 border-l-2 border-red-500' : 'text-gray-400 hover:bg-gray-800'}`}>
                <i class="fas fa-users-cog w-6"></i> Members
              </a>
              <a href="/admin/settings" class={`flex items-center p-3 text-sm font-medium rounded-lg transition ${activePath === '/admin/settings' ? 'bg-red-900/20 text-red-400 border-l-2 border-red-500' : 'text-gray-400 hover:bg-gray-800'}`}>
                <i class="fas fa-cogs w-6"></i> Site Settings
              </a>
            </>
          )}
        </nav>
      </div>

      <div class="p-4 bg-[#151A23] border border-gray-800 rounded-xl mt-10">
        <div class="flex items-center gap-3">
          <div class={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${isMember ? 'bg-gradient-to-tr from-purple-500 to-blue-500' : 'bg-gradient-to-tr from-red-500 to-orange-500'}`}>
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p class="text-sm font-bold text-white truncate w-24">{username}</p>
            <p class="text-xs text-green-400">● Online</p>
          </div>
        </div>
        <button class="mt-4 w-full text-xs text-red-400 hover:text-red-300 transition flex items-center justify-center gap-2" onclick="logout()">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </aside>
  );
};
