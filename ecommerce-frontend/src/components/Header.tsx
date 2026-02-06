import { Link } from "react-router-dom";
import type { CartItemType } from "../types";
import { ThemeSwitch } from "./ThemeSwitch";
import "./Header.css";

type HeaderProps = {
  cart: CartItemType[];
};

export function Header({ cart }: HeaderProps) {
  // let totalQuantity = 0;
  // cart.forEach((cartItem) => {
  //   totalQuantity += cartItem.quantity;
  // });

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

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
        <input className="search-bar" type="text" placeholder="Search" />

        <button className="search-button">
          <img className="search-icon" src="/images/icons/search-icon.png" />
        </button>
      </div>

      <div className="right-section">
        <Link className="orders-link header-link" to="/orders">
          <span className="orders-text">Orders</span>
        </Link>

        <Link className="cart-link header-link" to="/checkout">
          <img className="cart-icon" src="/images/icons/cart-icon.png" />
          <span className="cart-quantity">{totalQuantity}</span>
          <span className="cart-text">Cart</span>
        </Link>
      </div>
    </div>
  );
}
