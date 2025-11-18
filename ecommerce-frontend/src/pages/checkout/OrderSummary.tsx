import axios from "axios";
import dayjs from "dayjs";
import { formatMoney } from "../../utils/money";
import { DeliveryOptions } from "./DeliveryOptions";
import type { CartItemType, LoadCartFn, DeliveryOptionType } from "../../types";

type OrderSummaryProps = {
  cart: CartItemType[];
  deliveryOptions: DeliveryOptionType[];
  loadCart: LoadCartFn;
};

export function OrderSummary({
  cart,
  deliveryOptions,
  loadCart,
}: OrderSummaryProps) {
  const hasDeliveryOptions = deliveryOptions.length > 0;

  const handleDeleteCartItem = async (productId: string): Promise<void> => {
    await axios.delete(`/api/cart-items/${productId}`);
    await loadCart();
  };

  if (!hasDeliveryOptions) {
    return (
      <div className="order-summary">
        {<div>No delivery options available.</div>}
      </div>
    );
  }

  return (
    <div className="order-summary">
      {cart.map((cartItem) => {
        const selectedDeliveryOption = deliveryOptions.find(
          (deliveryOption) => {
            return deliveryOption.id === cartItem.deliveryOptionId;
          }
        );

        if (!selectedDeliveryOption) return null;

        // const deleteCartItem = async (): Promise<void> => {
        //   await axios.delete(`/api/cart-items/${cartItem.productId}`);
        //   await loadCart();
        // };

        return (
          <div key={cartItem.productId} className="cart-item-container">
            <div className="delivery-date">
              Delivery date:
              {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format(
                "dddd, MMMM D"
              )}
            </div>

            <div className="cart-item-details-grid">
              <img className="product-image" src={cartItem.product.image} />

              <div className="cart-item-details">
                <div className="product-name">{cartItem.product.name}</div>
                <div className="product-price">
                  {formatMoney(cartItem.product.priceCents)}
                </div>
                <div className="product-quantity">
                  <span>
                    Quantity:{cartItem.quantity}
                    {/* <span className="quantity-label"> */}
                  </span>
                  {/* </span> */}
                  <span className="update-quantity-link link-primary">
                    Update
                  </span>
                  <span
                    className="delete-quantity-link link-primary"
                    onClick={() => handleDeleteCartItem(cartItem.productId)}
                  >
                    Delete
                  </span>
                </div>
              </div>

              <DeliveryOptions
                cartItem={cartItem}
                deliveryOptions={deliveryOptions}
                loadCart={loadCart}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
