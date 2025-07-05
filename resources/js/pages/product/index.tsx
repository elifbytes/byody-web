import { Product } from "@/types/product";

interface ProductPageProps {
  products: Product[];
}
export default function ProductPage({  products }: ProductPageProps) {
    console.log("ProductPage", products);
    
  // This component is for displaying a list of products.
  return (
    <div>ProductPage</div>
  )
}
