import axios from "axios";
import { useEffect, useState } from "react";
import type { ProductType } from "../../types";
import { Header } from "../../components/Header";
import { ProductsGrid } from "./ProductsGrid";
import { useCartStore } from "../../store/useCartStore";
import "./HomePage.css";

export function HomePage() {
  const loadCart = useCartStore((s) => s.loadCart);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 設定頁面標題
  useEffect(() => {
    document.title = "Ecommerce Project";
  }, []);

  useEffect(() => {
    // 以下這裡的程式碼在「畫面渲染完成後」才執行！
    const getHomeData = async (): Promise<void> => {
      try {
        setLoading(true);
        const { data } = await axios.get<ProductType[]>("/api/products");
        //<ProductType[]>: 指 response.data 的型別
        setProducts(data);
      } catch (error) {
        setError("Failed to load products");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    getHomeData();
    //因為沒有寫 "await getHomeData()，useEffect 不會等待它完成。useEffect 的 callback 在這行之後就「結束」了。
  }, []);

  if (loading && products.length === 0) {
    return (
      <>
        <Header />
        <div className="home-page">Loading...</div>
      </>
    );
  }

  if (error && products.length === 0) {
    return (
      <>
        <Header />
        <div className="home-page">{error}</div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="home-page">
        <ProductsGrid products={products} loadCart={loadCart} />
      </div>
    </>
  );
}
