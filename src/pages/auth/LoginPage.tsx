import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Sparkles, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { roleMeta } from '../../utils/constants';
import type { Role } from '../../types';

const roleCards: { role: Role; icon: React.ReactNode; color: string }[] = [
  { role: 'manager', icon: <TrendingUp className="w-8 h-8" />, color: 'from-indigo-500 to-purple-500' },
  { role: 'pm', icon: <PieChart className="w-8 h-8" />, color: 'from-emerald-500 to-teal-500' },
  { role: 'analyst', icon: <BarChart3 className="w-8 h-8" />, color: 'from-blue-500 to-cyan-500' },
];

export function LoginPage() {
  const { isAuthenticated, isLoading, error, login, clearError } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<Role>('manager');
  const [password, setPassword] = useState('demo123');

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleLogin = () => {
    login(selectedRole, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ChatBI</h1>
          <p className="text-slate-400 text-sm">智能数据分析平台</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {roleCards.map(({ role, icon, color }) => (
            <button
              key={role}
              onClick={() => { setSelectedRole(role); clearError(); }}
              className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
                selectedRole === role
                  ? 'border-indigo-400 bg-white/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2`}>
                {icon}
              </div>
              <p className="text-white text-xs font-medium">{roleMeta[role].label}</p>
              <p className="text-slate-400 text-[10px] mt-0.5 leading-tight">{roleMeta[role].description}</p>
              {selectedRole === role && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Password */}
        <div className="bg-white/5 backdrop-blur rounded-xl p-5 border border-white/10">
          <label className="text-slate-300 text-sm mb-2 block">登录密码</label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); clearError(); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-colors"
              placeholder="请输入密码"
            />
          </div>
          <p className="text-slate-500 text-xs mt-2">演示密码：demo123</p>

          {error && (
            <p className="text-red-400 text-xs mt-3 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-lg py-3 font-medium text-sm transition-all cursor-pointer"
          >
            {isLoading ? '登录中...' : `以${roleMeta[selectedRole].label}身份登录`}
          </button>
        </div>
      </div>
    </div>
  );
}
