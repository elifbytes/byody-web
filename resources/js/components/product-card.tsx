import { Product } from '@/types/product';
import { Link } from '@inertiajs/react';
import { AspectRatio } from './ui/aspect-ratio';

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={product.default_url ? route('product.show', product.default_url.slug) : '#'}>
            <div className="hover:bg-gray-100">
                <AspectRatio ratio={1 / 1}>
                    <img
                        src={product.thumbnail?.original_url}
                        alt={product.attribute_data?.name.en}
                        className="h-full w-full rounded-sm object-cover"
                    />
                </AspectRatio>
                <div className="flex h-20 flex-col justify-between px-2 py-1">
                    <p className="line-clamp-2">{product.attribute_data?.name.en}</p>
                    <p className="text-sm font-medium">${product.decimal_price}</p>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
