import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router"; // 或 "react-router-dom"（視專案設定）
import { OrderSummary } from "./OrderSummary";
import { PaymentSummary } from "./PaymentSummary";
import type {
  CartItemType,
  LoadCartFn,
  DeliveryOptionType,
  PaymentSummaryType,
} from "../../types";
import "./checkout-header.css";
import "./CheckoutPage.css";

type CheckoutPageProps = {
  cart: CartItemType[];
  loadCart: LoadCartFn;
};

export function CheckoutPage({ cart, loadCart }: CheckoutPageProps) {
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOptionType[]>(
    []
  );
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummaryType>({
    totalItems: 0,
    productCostCents: 0,
    shippingCostCents: 0,
    totalCostBeforeTaxCents: 0,
    taxCents: 0,
    totalCostCents: 0,
  });

  const fetchCheckoutData = async (): Promise<void> => {
    const deliveryResponse = await axios.get<DeliveryOptionType[]>(
      "/api/delivery-options?expand=estimatedDeliveryTime"
    );
    setDeliveryOptions(deliveryResponse.data);

    const paymentResponse = await axios.get<PaymentSummaryType>(
      "/api/payment-summary"
    );
    setPaymentSummary(paymentResponse.data);
  };

  useEffect(() => {
    void fetchCheckoutData();
  }, [cart]);

  return (
    <>
      <title>Checkout</title>

      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <Link to="/">
              <img className="logo" src="images/logo.png" />
              <img className="mobile-logo" src="images/mobile-logo.png" />
            </Link>
          </div>

          <div className="checkout-header-middle-section">Checkout</div>

          <div className="checkout-header-right-section">
            <img src="images/icons/checkout-lock-icon.png" />
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <OrderSummary
            cart={cart}
            deliveryOptions={deliveryOptions}
            loadCart={loadCart}
          />

          <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />
        </div>
      </div>
    </>
  );
}
