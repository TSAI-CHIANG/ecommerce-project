import { create } from "zustand";
import axios from "axios";
import type { CartItemType } from "../types";

type CartStore = {
    cart: CartItemType[];
    loadCart: () => Promise<void>;
};

export const useCartStore = create<CartStore>((set) => ({
    cart: [], // 一開始購物車是空的
    loadCart: async () => {
        const { data } = await axios.get<CartItemType[]>(
            "/api/cart-items?expand=product"
        );
        set({ cart: data });  // ← 用 set 把資料存進 store
    },
}));
