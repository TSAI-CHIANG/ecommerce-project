import { create } from "zustand";
import axios from "axios";
import type { CartItemType } from "../types";

type CartStore = {
    cart: CartItemType[];
    isLoading: boolean;
    loadCart: () => Promise<void>;
    clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
    cart: [],
    isLoading: false,
    loadCart: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axios.get<CartItemType[]>(
                "/api/cart-items?expand=product"
            );
            set({ cart: data });
        } catch (error) {
            console.error('Failed to load cart:', error);
        } finally {
            set({ isLoading: false });
        }
    },
    clearCart: () => set({ cart: [] })
}));
