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
            onClick={updateDeliveryOption} //不需要傳參數時，直接傳函式名稱，需要傳參數時，就必須用 arrow function 包裝：onClick={() => updateDeliveryOption(cartItem.productId)}
          >
            <input
              className="delivery-option-input"
              type="radio"
              checked={deliveryOption.id === cartItem.deliveryOptionId}
              onChange={() => {}} //有 checked 就必須有 onChange，但真正的點擊邏輯已經放在父層 div 的 onClick={updateDeliveryOption}，所以這個 onChange 只是為了讓 React 不報錯而存在的空殼。
              name={`delivery-option-${cartItem.productId}`} //同一個 name 群組裡，只能選一個。
            />
            <div>
              <div className="delivery-option-date">
                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format(
                  "dddd, MMMM DD, YYYY"
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
