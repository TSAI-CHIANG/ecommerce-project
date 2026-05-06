import { Link, useNavigate } from "react-router-dom";
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

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    // 導向首頁並帶上 ?q=... 的查詢參數
    navigate(`/?q=${encodeURIComponent(trimmed)}`); //navigate() 不會真的重新載入頁面
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
