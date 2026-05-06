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

  // 讀取 URL 中的篩選參數
  const minPriceDollars = searchParams.get("minPrice") ?? "";
  const maxPriceDollars = searchParams.get("maxPrice") ?? "";
  const minRating = searchParams.get("minRating") ?? "";

  // 通用的更新 URL 參數函式：保留其他既有參數
  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams); //把目前 URL 的所有參數全部複製一份，不複製直接改的話，searchParams 是唯讀的，會出錯
    //useSearchParams 是「讀」，URLSearchParams 是「改字串」，navigate 是「真正更新 URL」。
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key); // value 是空字串 → 把這個參數從 URL 移除
    }
    navigate(`/?${params.toString()}`); //觸發 re-render
  };

  // 切換[排序]
  const handleSort = (value: string) => updateParam("sort", value);

  // 切換[最低評分篩選]
  const handleMinRating = (value: string) => updateParam("minRating", value);

  // 重設(reset)所有篩選（保留搜尋詞和排序）
  const handleResetFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("minRating");
    navigate(`/?${params.toString()}`);
  };

  // 檢查是否有任何篩選條件在作用中
  const hasActiveFilters = !!(minPriceDollars || maxPriceDollars || minRating); //!! 強制轉成 boolean

  // Step 1：依據關鍵字過濾商品
  const keywordFiltered = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  // Step 2：依據價格和評分篩選
  const filteredProducts = keywordFiltered.filter((p) => {
    // 價格轉換：使用者輸入 dollars，商品資料是 cents
    const minCents = minPriceDollars ? parseFloat(minPriceDollars) * 100 : null;
    const maxCents = maxPriceDollars ? parseFloat(maxPriceDollars) * 100 : null;
    const minStar  = minRating ? parseFloat(minRating) : null;

    if (minCents !== null && p.priceCents < minCents) return false; //&& 的短路：兩個條件都要成立
    if (maxCents !== null && p.priceCents > maxCents) return false;
    if (minStar  !== null && p.rating.stars < minStar) return false;
    return true;
  });

  // Step 3：依據 sortKey 排序（用 [...] 複製陣列，避免直接改變原始 state）
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
        {/* ── 工具列 ── */}
        <div className="filter-toolbar">

          {/* 第一行：搜尋結果提示 + 排序 */}
          <div className="toolbar-row">
            <div className="toolbar-left">
              {/* && 在 JSX 裡的意思是：左邊為真才渲染右邊 */}
              {searchQuery && (
                <p className="search-result-hint">
                  {keywordFiltered.length > 0
                    ? `Search "${searchQuery}"： ${keywordFiltered.length} items found`
                    : `Search "${searchQuery}"： no match results`}
                </p>
              )}
            </div>
            <div className="toolbar-right">
              <label className="filter-label" htmlFor="sort-select">Sort by：</label>
              <select
                id="sort-select"
                className="filter-select"
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

          {/* 第二行：篩選條件 */}
          <div className="toolbar-row toolbar-filter-row">
            {/* 價格範圍 */}
            <div className="filter-group">
              <span className="filter-label">Price ($)：</span>
              <input
                id="min-price"
                className="filter-input"
                type="number"
                placeholder="Min"
                min="0"
                value={minPriceDollars}
                onChange={(e) => updateParam("minPrice", e.target.value)}
              />
              <span className="filter-separator">–</span>
              <input
                id="max-price"
                className="filter-input"
                type="number"
                placeholder="Max"
                min="0"
                value={maxPriceDollars}
                onChange={(e) => updateParam("maxPrice", e.target.value)}
              />
            </div>

            {/* 最低評分 */}
            <div className="filter-group">
              <label className="filter-label" htmlFor="min-rating">Min Rating：</label>
              <select
                id="min-rating"
                className="filter-select"
                value={minRating}
                onChange={(e) => handleMinRating(e.target.value)}
              >
                <option value="">All</option>
                <option value="4.5">4.5 ★ & up</option>
                <option value="4">4 ★ & up</option>
                <option value="3">3 ★ & up</option>
                <option value="2">2 ★ & up</option>
              </select>
            </div>

            {/* 重設篩選按鈕（只有篩選條件存在時才顯示） */}
            {hasActiveFilters && (
              <button className="reset-filter-button" onClick={handleResetFilters}>
                ✕ Reset Filters
              </button>
            )}
          </div>  {/* end toolbar-row toolbar-filter-row */}

        </div>  {/* end filter-toolbar */}

        <ProductsGrid products={sortedProducts} loadCart={loadCart} />
      </div>
    </>
  );
}
