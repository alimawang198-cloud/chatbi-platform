import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Palette, LogOut, Moon, Sun, Monitor, ChevronRight, Info, Check, TriangleAlert, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { roleMeta } from '../../utils/constants';
import type { Role } from '../../types';

const roles: Role[] = ['manager', 'pm', 'analyst'];

export function SettingsPage() {
  const user = useAuthStore(s => s.user);
  const activeRole = useAuthStore(s => s.activeRole);
  const setActiveRole = useAuthStore(s => s.setActiveRole);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-8 animate-fade-in max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-6">设置</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-4">
          <Avatar name={user?.displayName || 'U'} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800">{user?.displayName}</h3>
            <p className="text-sm text-slate-400">{user?.username}@{user?.role}</p>
            <Badge variant="info" className="mt-1">{roleMeta[user?.role || 'manager']?.label}</Badge>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setProfileOpen(true)}>
            编辑资料
          </Button>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">当前角色视角</h3>
        <div className="flex gap-2">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                activeRole === role
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div>{roleMeta[role]?.label}</div>
              <div className="text-xs text-slate-400 font-normal mt-0.5">{roleMeta[role]?.description || ''}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">切换角色后，Dashboard 和 ChatBI 的数据视角将自动更新</p>
      </div>

      {/* Settings Menu */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <SettingRow icon={<User className="w-4 h-4" />} label="个人信息" desc="查看和编辑个人资料" onClick={() => setProfileOpen(true)} />
        <SettingRow icon={<Palette className="w-4 h-4" />} label="界面设置" desc={theme === 'light' ? '浅色模式' : theme === 'dark' ? '深色模式' : '跟随系统'} onClick={() => setThemeOpen(true)} />
        <SettingRow icon={<Bell className="w-4 h-4" />} label="通知设置" desc="管理消息和邮件通知偏好" onClick={() => setNotifyOpen(true)} />
        <SettingRow icon={<Lock className="w-4 h-4" />} label="修改密码" desc="更新您的登录密码" onClick={() => setPwdOpen(true)} />
        <SettingRow icon={<Info className="w-4 h-4" />} label="关于" desc="版本信息和 Demo 账号" onClick={() => setAboutOpen(true)} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setLogoutOpen(true)}
          className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>

      {/* === Modals === */}

      {/* Profile Edit Modal */}
      <Modal open={profileOpen} onClose={() => setProfileOpen(false)} title="编辑个人资料" size="lg">
        <div className="space-y-4">
          <div className="flex justify-center pb-2">
            <Avatar name={user?.displayName || 'U'} size="xl" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">显示名称</label>
            <input type="text" defaultValue={user?.displayName} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-slate-50/50 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">邮箱地址</label>
            <input type="email" defaultValue={`${user?.username}@company.com`} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-slate-50/50 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">所属部门</label>
            <input type="text" defaultValue="数据平台部" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-slate-50/50 transition-colors" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setProfileOpen(false)}>取消</Button>
            <Button onClick={() => setProfileOpen(false)}>保存更改</Button>
          </div>
        </div>
      </Modal>

      {/* Theme Modal */}
      <Modal open={themeOpen} onClose={() => setThemeOpen(false)} title="界面设置" size="lg">
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'light' as const, icon: Sun, label: '浅色模式', desc: '明亮背景，适合日间使用', bg: 'bg-white' },
            { value: 'dark' as const, icon: Moon, label: '深色模式', desc: '暗色背景，减少眼部疲劳', bg: 'bg-slate-800' },
            { value: 'system' as const, icon: Monitor, label: '跟随系统', desc: '自动匹配操作系统设置', bg: 'bg-gradient-to-br from-white via-slate-200 to-slate-800' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl text-center transition-all cursor-pointer border-2 ${
                theme === opt.value
                  ? 'border-indigo-400 bg-indigo-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-full h-16 rounded-lg border ${theme === opt.value ? 'border-indigo-200' : 'border-slate-200'} ${opt.bg} flex items-center justify-center`}>
                <opt.icon className={`w-6 h-6 ${opt.value === 'dark' ? 'text-slate-300' : 'text-slate-500'}`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${theme === opt.value ? 'text-indigo-700' : 'text-gray-700'}`}>{opt.label}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">{opt.desc}</p>
              </div>
              {theme === opt.value && <Check className="w-4 h-4 text-indigo-500" />}
            </button>
          ))}
        </div>
      </Modal>

      {/* Notification Modal */}
      <Modal open={notifyOpen} onClose={() => setNotifyOpen(false)} title="通知设置" size="lg">
        <div className="divide-y divide-slate-100 -mx-1">
          {[
            { label: '异常指标预警', desc: '当核心指标出现异常波动时及时通知', checked: true },
            { label: '数据更新通知', desc: '数据源更新完成后发送提醒', checked: true },
            { label: '报告生成完成', desc: '分析报告自动生成完毕后通知', checked: true },
            { label: '系统维护公告', desc: '系统升级和维护计划提前告知', checked: false },
            { label: '周报推送', desc: '每周一自动推送上周数据周报', checked: true },
            { label: '产品更新动态', desc: '新功能上线和版本更新通知', checked: false },
          ].map(item => (
            <label key={item.label} className="flex items-center justify-between py-3 px-1 cursor-pointer group">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <ToggleSwitch checked={item.checked} />
            </label>
          ))}
        </div>
        <div className="flex justify-end pt-3">
          <Button onClick={() => setNotifyOpen(false)}>保存设置</Button>
        </div>
      </Modal>

      {/* Password Modal */}
      <Modal open={pwdOpen} onClose={() => setPwdOpen(false)} title="修改密码" size="lg">
        <div className="space-y-4">
          <PasswordField label="当前密码" defaultValue="demo123" />
          <PasswordField label="新密码" placeholder="输入新密码" />
          <PasswordField label="确认新密码" placeholder="再次输入新密码" />
          <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <TriangleAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              <span className="font-medium">密码要求：</span>
              至少8位字符，包含大小写字母和数字组合
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={() => setPwdOpen(false)}>取消</Button>
            <Button onClick={() => setPwdOpen(false)}>确认修改</Button>
          </div>
        </div>
      </Modal>

      {/* Logout Modal */}
      <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="退出登录" size="sm">
        <div className="space-y-5">
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-800">确认退出</p>
              <p className="text-xs text-red-600 mt-0.5">退出后需要重新输入账号密码才能访问系统。</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setLogoutOpen(false)}>取消</Button>
            <Button className="!bg-red-500 hover:!bg-red-600" onClick={handleLogout}>确认退出</Button>
          </div>
        </div>
      </Modal>

      {/* About Modal */}
      <Modal open={aboutOpen} onClose={() => setAboutOpen(false)} title="关于 ChatBI" size="lg">
        <div className="space-y-5">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800">ChatBI</h3>
            <p className="text-sm text-slate-400 mt-0.5">智能数据分析平台 v2.0.0</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <InfoBlock label="版本号" value="v2.0.0 Build 20260710" />
            <InfoBlock label="前端框架" value="React 18 + TypeScript" />
            <InfoBlock label="图表引擎" value="ECharts 5 + 自定义组件" />
            <InfoBlock label="状态管理" value="Zustand + LocalStorage" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2.5 uppercase tracking-wide">Demo 账号</p>
            <div className="space-y-2">
              {[
                { name: '张总 / demo123', role: '副总裁视角 — 全局经营数据', color: 'border-l-indigo-500' },
                { name: '王产品 / demo123', role: '产品经理视角 — 产品与用户指标', color: 'border-l-purple-500' },
                { name: '王分析 / demo123', role: '分析师视角 — 深度数据探索', color: 'border-l-emerald-500' },
              ].map((a, i) => (
                <div key={i} className={`text-sm bg-slate-50 rounded-lg px-4 py-2.5 border-l-2 ${a.color}`}>
                  <span className="font-medium text-gray-700">{a.name}</span>
                  <span className="text-xs text-slate-400 ml-2">{a.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SettingRow({ icon, label, desc, onClick }: { icon: React.ReactNode; label: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer text-left border-b border-slate-50 last:border-b-0">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300" />
    </button>
  );
}

function PasswordField({ label, defaultValue, placeholder }: { label: string; defaultValue?: string; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600 mb-1.5 block">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full px-3 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-slate-50/50 transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function ToggleSwitch({ checked }: { checked: boolean }) {
  return (
    <div className={`w-10 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${checked ? 'bg-indigo-500' : 'bg-slate-200'}`}>
      <div className={`w-5 h-5 rounded-full bg-white shadow-sm border border-slate-200 transition-transform mt-0.5 ${checked ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-[10px] text-slate-400 uppercase font-semibold mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-700">{value}</p>
    </div>
  );
}
