import axios from "axios";
import { Routes, Route } from "react-router";
import { useState, useEffect } from "react";
import { HomePage } from "./pages/home/HomePage";
import { CheckoutPage } from "./pages/checkout/CheckoutPage";
import { OrdersPage } from "./pages/orders/OrdersPage";
import { ChatbotWidget } from "./components/chatbot/ChatbotWidget";
import "./App.css";
import { type CartItemType, type LoadCartFn } from "./types";

function App() {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const loadCart: LoadCartFn = async () => {
    const response = await axios.get<CartItemType[]>(
      "/api/cart-items?expand=product"
    );
    setCart(response.data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <>
      <Routes>
        <Route index element={<HomePage cart={cart} loadCart={loadCart} />} />
        <Route
          path="checkout"
          element={<CheckoutPage cart={cart} loadCart={loadCart} />}
        />
        <Route path="orders" element={<OrdersPage cart={cart} />} />
      </Routes>

      <ChatbotWidget />
    </>
  );
}

export default App;
