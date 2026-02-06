import { Product } from "./Product";
import type { LoadCartFn, ProductType } from "../../types";

type ProductsGridProps = {
  products: ProductType[];
  loadCart: LoadCartFn; //loadCart?: LoadCartFn
};

export function ProductsGrid({ products, loadCart }: ProductsGridProps) {
  return (
    <div className="products-grid">
      {products.map((product) => { // .map() 會把每個商品變成一個 <Product> 元件
        return (
          <Product 
            key={product.id} // React 用的，不會傳給元件
            product={product} // 把商品資料傳給 Product 元件
            loadCart={loadCart} // 把重新載入購物車的函數傳給 Product 元件
          />
        );
      })}
    </div>
  );
}
