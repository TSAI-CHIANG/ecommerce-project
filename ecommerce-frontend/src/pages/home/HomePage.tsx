import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  const [searchParams] = useSearchParams();   
  // useSearchParams → 讀取目前 URL 的參數（和 React 綁定）
  const navigate = useNavigate();

  // 讀取 URL 中 ?q=... 的搜尋關鍵字，如果沒有就是空字串
  const searchQuery = searchParams.get("q") ?? ""; //??左邊是 null 或 undefined 才用右邊；否則用左邊。

  // 讀取 URL 中 ?sort=... 的排序方式，如果沒有就是空字串（預設不排序）
  const sortKey = searchParams.get("sort") ?? "";

  // 切換排序：更新 URL 的 sort 參數，保留原本的 q 搜尋參數
  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams); //useSearchParams 是「讀」，URLSearchParams 是「改字串」，navigate 是「真正更新 URL」。
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort"); // 選「預設」時移除 sort 參數
    }
    navigate(`/?${params.toString()}`);
  };

  // 依據關鍵字過濾商品（對名稱做大小寫不敏感比對）
  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  // 依據 sortKey 排序（用 [...] 複製陣列，避免直接改變原始 state）
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortKey === "price-asc")    return a.priceCents - b.priceCents;
    if (sortKey === "price-desc")   return b.priceCents - a.priceCents;
    if (sortKey === "rating-desc")  return b.rating.stars - a.rating.stars;
    if (sortKey === "rating-asc")   return a.rating.stars - b.rating.stars;
    return 0; // 預設不排序
  });

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
        {/* 搜尋結果提示 + 排序工具列 */}
        <div className="sort-toolbar">
          <div className="sort-left">
            {/* 如果有在搜尋，顯示搜尋結果提示 */}
            {/* && 在 JSX 裡的意思是：左邊為真才渲染右邊 */}
            {searchQuery && (
              <p className="search-result-hint">
                {
                  filteredProducts.length > 0
                    ? `Search "${searchQuery}"： ${filteredProducts.length} items found`
                    : `Search "${searchQuery}"： no match results`
                }
              </p>
            )}
          </div>

          <div className="sort-right">
            <label className="sort-label" htmlFor="sort-select">Sort by：</label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortKey}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
            </select>
          </div>
        </div>

        <ProductsGrid products={sortedProducts} loadCart={loadCart} />
      </div>
    </>
  );
}
