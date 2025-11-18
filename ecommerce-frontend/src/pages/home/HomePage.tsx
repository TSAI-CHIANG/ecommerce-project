import axios from "axios";
import { useEffect, useState } from "react";
import type { LoadCartFn, CartItemType, ProductType } from "../../types";
import { Header } from "../../components/Header";
import { ProductsGrid } from "./ProductsGrid";
import "./HomePage.css";

type HomePageProps = {
  cart: CartItemType[];
  loadCart: LoadCartFn;
};

export function HomePage({ cart, loadCart }: HomePageProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getHomeData = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await axios.get<ProductType[]>("/api/products");
        setProducts(response.data);
      } catch (error) {
        setError("Failed to load products");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    void getHomeData();
  }, []);

  if (loading && products.length === 0) {
    return (
      <>
        <Header cart={cart} />
        <div className="home-page">Loading...</div>
      </>
    );
  }

  if (error && products.length === 0) {
    return (
      <>
        <Header cart={cart} />
        <div className="home-page">{error}</div>
      </>
    );
  }

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
