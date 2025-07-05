import { Product } from '@/types/product';
import ProductCard from './product-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

interface ProductsCarouselProps {
    products: Product[];
}

function ProductsCarousel({ products }: ProductsCarouselProps) {
    if (!products || products.length === 0) {
        return <div className="text-center text-gray-500">No products available</div>;
    }
    return (
        <Carousel className="mx-auto w-screen md:max-w-3xl lg:max-w-4xl xl:max-w-7xl">
            <CarouselContent>
                {products.map((product) => (
                    <CarouselItem key={product.id} className="basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                        <ProductCard key={product.id} product={product} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
        </Carousel>
    );
}

export default ProductsCarousel;
