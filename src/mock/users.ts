import type { User } from '../types';

export const users: Record<string, { password: string; user: User }> = {
  manager: {
    password: 'demo123',
    user: {
      id: '1',
      username: 'manager',
      role: 'manager',
      displayName: '张总',
      roleLabel: '副总裁',
    },
  },
  pm: {
    password: 'demo123',
    user: {
      id: '2',
      username: 'pm',
      role: 'pm',
      displayName: '王产品',
      roleLabel: '产品经理',
    },
  },
  analyst: {
    password: 'demo123',
    user: {
      id: '3',
      username: 'analyst',
      role: 'analyst',
      displayName: '王分析',
      roleLabel: '数据分析师',
    },
  },
};
