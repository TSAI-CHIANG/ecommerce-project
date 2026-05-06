import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { ThemeSwitch } from "./ThemeSwitch";
import "./Header.css";

export function Header() {
  const cart = useCartStore((s) => s.cart);
  const { isAuthenticated, logout, user } = useAuthStore();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  // let totalQuantity = 0;
  // for (const item of cart) {
  //   totalQuantity += item.quantity;
  // }

  const [searchQuery, setSearchQuery] = useState(""); //searchQuery：控制搜尋框顯示的文字（使用者輸入的搜尋關鍵字）
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // 讀取目前 URL 參數，搜尋時才能保留 sort 參數

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    // 複製現有 URL 參數（保留 sort 等其他參數）
    const params = new URLSearchParams(searchParams);
    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    } else {
      params.delete("q"); // 搜尋字串為空時，移除 q 參數
    }
    navigate(`/?${params.toString()}`); //navigate() 不會真的重新載入頁面
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="header">
      <div className="left-section">
        <Link to="/" className="header-link">
          <img className="logo" src="/images/logo.png" />
          <img className="mobile-logo" src="/images/mobile-logo.png" />
          {/* 根據proxy設定(vite.config.ts)，這裡的/images會自動去後端找 */}
        </Link>
        <ThemeSwitch />
      </div>

      <div className="middle-section">
        <input
          className="search-bar"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button className="search-button" onClick={handleSearch}>
          <img className="search-icon" src="/images/icons/search-icon.png" />
        </button>
      </div>

      <div className="right-section">
        {isAuthenticated ? (
          <div className="header-user-info">
             <span className="welcome-text">Hi, {user?.name}</span>
             <button onClick={logout} className="logout-button header-link">Logout</button>
             <Link className="orders-link header-link" to="/orders">
               <span className="orders-text">Orders</span>
             </Link>
          </div>
        ) : (
          <Link className="login-link header-link" to="/login">
            <span className="login-text">Sign In</span>
          </Link>
        )}

        <Link className="cart-link header-link" to="/checkout">
          <img className="cart-icon" src="/images/icons/cart-icon.png" />
          <span className="cart-quantity">{totalQuantity}</span>
          <span className="cart-text">Cart</span>
        </Link>
      </div>
    </div>
  );
}
