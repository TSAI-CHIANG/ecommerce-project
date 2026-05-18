import { Routes, Route } from "react-router";
import { useEffect } from "react";
import { HomePage } from "./pages/home/HomePage";
import { CheckoutPage } from "./pages/checkout/CheckoutPage";
import { OrdersPage } from "./pages/orders/OrdersPage";
import { LoginPage } from "./pages/login/LoginPage";
import { RegisterPage } from "./pages/register/RegisterPage";
import { ProtectedRoute, GuestRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./components/MainLayout";
import { useCartStore } from "./store/useCartStore";
import { useAuthStore } from "./store/useAuthStore";
import "./App.css";

function App() {
  const loadCart = useCartStore((state) => state.loadCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  //每當登入狀態改變時，如果是已登入，就去後端載入購物車資料:
  useEffect(() => {
    if (isAuthenticated) {
      void loadCart();
    }
  }, [isAuthenticated]);

  return (
    <>
      <Routes>
        {/* 套用 MainLayout 的頁面才有機器人 */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />

          {/* 需要登入才能進去的核心頁面 */}
          <Route element={<ProtectedRoute />}> 
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<OrdersPage />} />
          </Route>
        </Route>

        {/* Guest 才能進去的頁面（已登入會被導回首頁，且沒有機器人） */}
        <Route element={<GuestRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
