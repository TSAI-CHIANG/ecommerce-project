import { Product } from "./Product";
import { type LoadCartFn } from "../../App";

export type ProductType = {
  id: string;
  name: string;
  priceCents: number;
  image: string;
  rating: {
    stars: number;
    count: number;
  };
};

type ProductsGridProps = {
  products: ProductType[];
  loadCart: LoadCartFn; //loadCart?: LoadCartFn
};

export function ProductsGrid({ products, loadCart }: ProductsGridProps) {
  return (
    <div className="products-grid">
      {products.map((product) => {
        return (
          <Product key={product.id} product={product} loadCart={loadCart} />
        );
      })}
    </div>
  );
}
