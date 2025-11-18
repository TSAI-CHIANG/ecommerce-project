import dayjs from "dayjs";
import axios from "axios";
import { formatMoney } from "../../utils/money";
import type { CartItemType, LoadCartFn, DeliveryOptionType } from "../../types";

type DeliveryOptionsProps = {
  cartItem: CartItemType;
  deliveryOptions: DeliveryOptionType[];
  loadCart: LoadCartFn;
};

export function DeliveryOptions({
  cartItem,
  deliveryOptions,
  loadCart,
}: DeliveryOptionsProps) {
  return (
    <div className="delivery-options">
      <div className="delivery-options-title">Choose a delivery option:</div>
      {deliveryOptions.map((deliveryOption) => {
        let priceString = "FREE Shipping";

        if (deliveryOption.priceCents > 0) {
          priceString = `${formatMoney(deliveryOption.priceCents)} - Shipping`;
        }

        const updateDeliveryOption = async (): Promise<void> => {
          await axios.put(`/api/cart-items/${cartItem.productId}`, {
            deliveryOptionId: deliveryOption.id,
          });
          await loadCart(); //每次選運送方法後都要執行這個updateDeliveryOption下的loadCart？？？會不會沒效率???
        };

        return (
          <div
            key={deliveryOption.id}
            className="delivery-option"
            onClick={updateDeliveryOption}
          >
            <input
              className="delivery-option-input"
              type="radio"
              checked={deliveryOption.id === cartItem.deliveryOptionId}
              onChange={() => {}}
              name={`delivery-option-${cartItem.productId}`}
            />
            <div>
              <div className="delivery-option-date">
                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format(
                  "dddd, MMMM D"
                )}
              </div>
              <div className="delivery-option-price">{priceString}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
