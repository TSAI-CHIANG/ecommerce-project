import { Routes, Route } from "react-router";
import { useEffect } from "react";
import { HomePage } from "./pages/home/HomePage";
import { CheckoutPage } from "./pages/checkout/CheckoutPage";
import { OrdersPage } from "./pages/orders/OrdersPage";
import { LoginPage } from "./pages/login/LoginPage";
import { ProtectedRoute, GuestRoute } from "./components/ProtectedRoute";
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
        
        {/* Guest 才能進去的頁面（已經登入的話會被導回首頁） */}
        <Route element={<GuestRoute />}>
          <Route path="login" element={<LoginPage />} />
        </Route>

        {/* 需要登入才能進去的核心頁面 */}
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>
      </Routes>

      <ChatbotWidget />
    </>
  );
}

export default App;
