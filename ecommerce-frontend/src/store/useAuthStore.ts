import { create } from 'zustand';
import type { UserType } from '../types';
import axios from 'axios';
import { useCartStore } from './useCartStore';


type AuthState = {
    user: UserType | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
};


// 初始化時，試著從 localStorage 讀取 user 資料
const getLocalStoredUser = (): UserType | null => {
    try {
        return JSON.parse(localStorage.getItem('ecommerce-user') || 'null')
    } catch {
        return null
    }
};

const storedUser = getLocalStoredUser();

export const useAuthStore = create<AuthState>((set) => ({
    user: storedUser,
    isAuthenticated: storedUser !== null,

    login: async (email, password) => {
        try {
            const response = await axios.post<UserType>(
                '/api/auth/login',
                { email, password }
            );
            const userData: UserType = response.data;
            set({ user: userData, isAuthenticated: true });
            localStorage.setItem('ecommerce-user', JSON.stringify(userData));
            return true;

        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                //401 = Unauthorized，代表帳號或密碼錯誤
                //回傳 false，讓 LoginPage 顯示對應的錯誤訊息提示
                //?為選擇性屬性呼叫，完全斷線時 error.response 是 undefined，所以要加?
                return false;
            }
            //不是 axios 錯誤，或 status 不是 401（例如 500 伺服器錯誤），就 throw error 往上拋
            throw error;
        }
    },

    register: async (name, email, password) => {
        try {
            const response = await axios.post<UserType>(
                '/api/auth/register',
                { name, email, password }
            );
            const userData: UserType = response.data;
            set({ user: userData, isAuthenticated: true });
            localStorage.setItem('ecommerce-user', JSON.stringify(userData));
            return true;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                return false;
            }
            throw error;
        }
    },

    logout: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('ecommerce-user');
        // 登出時同步清空購物車，避免下一個使用者看到舊資料
        useCartStore.getState().clearCart();
        //getState() 是 Zustand 提供的 API
    },
}));
