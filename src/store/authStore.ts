import { create } from 'zustand';
import type { User, Role } from '../types';
import { users } from '../mock/users';

interface AuthState {
  user: User | null;
  activeRole: Role;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setActiveRole: (role: Role) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const savedUser = localStorage.getItem('chatbi_user');
  const savedRole = localStorage.getItem('chatbi_active_role') as Role | null;
  const initialUser = savedUser ? JSON.parse(savedUser) : null;
  const initialRole = savedRole && ['manager', 'pm', 'analyst'].includes(savedRole) ? savedRole : (initialUser?.role || 'manager');

  return {
    user: initialUser,
    activeRole: initialRole,
    isAuthenticated: !!initialUser,
    isLoading: false,
    error: null,

    login: async (username: string, password: string) => {
      set({ isLoading: true, error: null });
      await new Promise(r => setTimeout(r, 600));

      const key = username.toLowerCase();
      const entry = users[key];

      if (!entry || entry.password !== password) {
        set({ isLoading: false, error: '用户名或密码错误' });
        return false;
      }

      const user = entry.user;
      localStorage.setItem('chatbi_user', JSON.stringify(user));
      localStorage.setItem('chatbi_active_role', user.role);

      set({ user, activeRole: user.role, isAuthenticated: true, isLoading: false });
      return true;
    },

    logout: () => {
      localStorage.removeItem('chatbi_user');
      localStorage.removeItem('chatbi_active_role');
      set({ user: null, isAuthenticated: false, error: null });
    },

    setActiveRole: (role: Role) => {
      localStorage.setItem('chatbi_active_role', role);
      set({ activeRole: role });
    },

    clearError: () => set({ error: null }),
  };
});
