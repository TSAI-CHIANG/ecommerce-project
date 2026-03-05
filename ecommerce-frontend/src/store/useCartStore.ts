import { create } from "zustand";
import axios from "axios";
import type { CartItemType } from "../types";

type CartStore = {
    cart: CartItemType[];
    loadCart: () => Promise<void>;
};

export const useCartStore = create<CartStore>((set) => ({
    cart: [],
    loadCart: async () => {
        const { data } = await axios.get<CartItemType[]>(
            "/api/cart-items?expand=product"
        );
        set({ cart: data });
    },
}));
