import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, FileText, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight, Sparkles, Database } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../common/Avatar';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: '数据概览' },
  { to: '/chatbi', icon: MessageSquare, label: '智能问答' },
  { to: '/reports', icon: FileText, label: '分析报告' },
  { to: '/analyze', icon: BarChart3, label: '多维分析' },
  { to: '/semantic', icon: Database, label: '语义层管理' },
  { to: '/settings', icon: Settings, label: '设置' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'bg-slate-900 text-white flex flex-col h-screen sticky top-0 transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[280px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {!collapsed && <span className="font-bold text-base whitespace-nowrap">ChatBI</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-6 py-10 space-y-14 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-5 px-5 py-6 rounded-xl text-[15px] font-medium transition-all duration-200',
                isActive
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              )
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-5">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <Avatar name={user?.displayName || 'U'} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.displayName}</p>
              <p className="text-xs text-slate-400 truncate">{user?.roleLabel}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-2 text-xs text-slate-400 hover:text-red-400 mt-4 transition-colors w-full',
            collapsed ? 'justify-center' : 'px-5'
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>退出登录</span>}
        </button>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-700 border-2 border-white flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
