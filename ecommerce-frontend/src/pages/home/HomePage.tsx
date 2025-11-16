import axios from "axios";
import { useEffect, useState } from "react";
import type { LoadCartFn } from "../../App";
import { Header } from "../../components/Header";
import { ProductsGrid } from "./ProductsGrid";
import "./HomePage.css";

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

type HomePageProps = {
  cart: CartItemType[];
  loadCart: LoadCartFn;
};

export function HomePage({ cart, loadCart }: HomePageProps) {
  const [products, setProducts] = useState([]);

  const getHomeData = async () => {
    const response = await axios.get("/api/products");
    setProducts(response.data);
  };

  useEffect(() => {
    getHomeData();
  }, []);

  return (
    <>
      <title>Ecommerce Project</title>

      <Header cart={cart} />

      <div className="home-page">
        <ProductsGrid products={products} loadCart={loadCart} />
      </div>
    </>
  );
}
