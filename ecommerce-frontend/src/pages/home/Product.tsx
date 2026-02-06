import axios from "axios";
import { useState, type ChangeEvent } from "react";
import { formatMoney } from "../../utils/money";
import type { LoadCartFn, ProductType } from "../../types";

type ProductProps = {
  product: ProductType; //每一單一物件（一個商品）
  loadCart: LoadCartFn;
};

// 大寫：這個值永遠不會變
const QUANTITY_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

export function Product({ product, loadCart }: ProductProps) {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdded, setShowAdded] = useState(false);  // 控制「Added」訊息顯示
  const [error, setError] = useState<string | null>(null);  // 錯誤訊息

  const addToCart = async (): Promise<void> => {
    try {
      setIsSubmitting(true);

      await axios.post("/api/cart-items", {
        productId: product.id,
        quantity,
      });
      await loadCart();

      // 顯示「Added」訊息：
      setShowAdded(true);
      setTimeout(() => setShowAdded(false), 2000);  // 2 秒後隱藏“Added”訊息
      
    } catch (error) {
      console.error("add to cart error:", error);
      // 顯示錯誤訊息給使用者：
      setError("加入購物車失敗");
      setTimeout(() => setError(null), 3000);  // 3 秒後隱藏錯誤訊息
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectQuantity = (event: ChangeEvent<HTMLSelectElement>): void => {
    const quantitySelected = Number(event.target.value); //event.target.value 永遠是 string，表示選中的 option 的 value
    setQuantity(quantitySelected);
  };

  return (
    <div className="product-container" data-testid="product-container">
      <div className="product-image-container">
        <img
          className="product-image"
          data-testid="product-image"
          src={product.image}
        />
      </div>

      <div className="product-name limit-text-to-2-lines">{product.name}</div>

      <div className="product-rating-container">
        <img
          className="product-rating-stars"
          data-testid="product-rating-stars-image"
          src={`/images/ratings/rating-${product.rating.stars * 10}.png`}
        />
        <div className="product-rating-count link-primary">
          {product.rating.count}
        </div>
      </div>

      <div className="product-price">{formatMoney(product.priceCents)}</div>

      <div className="product-quantity-container">
        {/* 以下select為受控元件(React 控制顯示什麼值)，value={quantity} :畫面永遠顯示 quantity 的值*/}
        <select value={quantity} onChange={selectQuantity}>
          {QUANTITY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="product-spacer"></div>

      <div className={`added-to-cart ${showAdded ? "visible" : ""}`}>
        <img src="/images/icons/checkmark.png" />
        Added
      </div>

      {/* 給使用者加入購物車的錯誤訊息顯示 */}
      {error && (
        <div style={{ color: "red", fontSize: "14px", marginBottom: "8px" }}>
          {error}
        </div>
      )}

      <button
        className="add-to-cart-button button-primary"
        data-testid="add-to-cart-button"
        onClick={addToCart}
        disabled={isSubmitting} //防止重複提交當 isSubmitting 為 true 時，按鈕會被禁用（無法點擊）
      >
        {isSubmitting ? "Submitting" : "Add to Cart"}
      </button>
    </div>
  );
}
