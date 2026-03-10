import { create } from 'zustand';
import type { UserType } from '../types';

type AuthState = {
    user: UserType | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
};

// 這是 Mock 的使用者資料庫
const MOCK_USERS: Record<string, UserType & { password: string }> = {
    'admin@example.com': {
        id: 'u1',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
    },
    'test@example.com': {
        id: 'u2',
        name: 'Test Member',
        email: 'test@example.com',
        password: '123',
    },
};

export const useAuthStore = create<AuthState>((set) => ({
    // 初始化時，試著從 localStorage 讀取 user 資料
    user: JSON.parse(localStorage.getItem('ecommerce-user') || 'null'),
    isAuthenticated: !!localStorage.getItem('ecommerce-user'),

    login: async (email, password) => {
        // 模擬 API 延遲
        await new Promise((resolve) => setTimeout(resolve, 800));

        const foundUser = MOCK_USERS[email];
        if (foundUser && foundUser.password === password) {
            const userData: UserType = {
                id: foundUser.id,
                name: foundUser.name,
                email: foundUser.email,
            };

            // 儲存到 state 並持久化到 localStorage
            set({ user: userData, isAuthenticated: true });
            localStorage.setItem('ecommerce-user', JSON.stringify(userData));
            return true;
        }

        return false;
    },

    logout: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('ecommerce-user');
    },
}));
