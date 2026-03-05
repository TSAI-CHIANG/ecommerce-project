import { Routes, Route } from "react-router";
import { useEffect } from "react";
import { HomePage } from "./pages/home/HomePage";
import { CheckoutPage } from "./pages/checkout/CheckoutPage";
import { OrdersPage } from "./pages/orders/OrdersPage";
import { ChatbotWidget } from "./components/chatbot/ChatbotWidget";
import { useCartStore } from "./store/useCartStore";
import "./App.css";

function App() {
  const loadCart = useCartStore((s) => s.loadCart);

  useEffect(() => {
    void loadCart();
  }, []);

  return (
    <>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
      </Routes>

      <ChatbotWidget />
    </>
  );
}

export default App;
