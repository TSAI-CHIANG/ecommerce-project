export type LoadCartFn = () => void | Promise<void>;

export type CartItemType = {
  id: number;
  productId: string;
  quantity: number;
  deliveryOptionId: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    priceCents: number;
    image: string;
    name: string;
  };
};

export type ProductType = {
  keywords: string[];
  id: string;
  name: string;
  priceCents: number;
  image: string;
  rating: {
    stars: number;
    count: number;
  };
};

export type DeliveryOptionType = {
  id: string;
  deliveryDays: number;
  priceCents: number;
  estimatedDeliveryTimeMs: number;
};

export type PaymentSummaryType = {
  totalItems: number;
  productCostCents: number;
  shippingCostCents: number;
  totalCostBeforeTaxCents: number;
  taxCents: number;
  totalCostCents: number;
};