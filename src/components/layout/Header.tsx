import { useAuthStore } from '../../store/authStore';
import { roleMeta } from '../../utils/constants';
import { Avatar } from '../common/Avatar';
import { cn } from '../../utils/cn';
import type { Role } from '../../types';

const roles: Role[] = ['manager', 'pm', 'analyst'];

export function Header() {
  const user = useAuthStore(s => s.user);
  const activeRole = useAuthStore(s => s.activeRole);
  const setActiveRole = useAuthStore(s => s.setActiveRole);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          欢迎回来，{user?.displayName}
        </h2>
        <p className="text-xs text-gray-400">
          当前视角：{roleMeta[activeRole]?.label}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={cn(
                'px-4 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer',
                activeRole === role
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              {roleMeta[role]?.label}
            </button>
          ))}
        </div>

        <Avatar name={user?.displayName || 'U'} size="sm" />
      </div>
    </header>
  );
}
