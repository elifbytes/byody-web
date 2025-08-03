import { formatPrice } from '@/lib/price';
import { Product } from '@/types/product';
import { Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { AspectRatio } from './ui/aspect-ratio';

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const formattedPrice = formatPrice(product.variants?.[0].prices?.[0].price);
    const formattedComparePrice =
        product.variants?.[0].prices?.[0].compare_price?.value !== 0 ? formatPrice(product.variants?.[0].prices?.[0].compare_price) : null;

    // Collect all variant images with useMemo to prevent re-renders
    const imagesToShow = useMemo(() => {
        const variantImages = product.variants?.flatMap((variant) => variant.images || []) || [];

        // Use variant images if available, otherwise fall back to product media or thumbnail
        return variantImages.length > 0
            ? variantImages
            : product.media && product.media.length > 0
              ? product.media
              : product.thumbnail
                ? [product.thumbnail]
                : [];
    }, [product.variants, product.media, product.thumbnail]);

    // Get the default thumbnail (first image to show when not hovering)
    const defaultThumbnail = useMemo(() => {
        return product.thumbnail || imagesToShow[0] || null;
    }, [product.thumbnail, imagesToShow]);

    // Manual slideshow effect
    useEffect(() => {
        if (!isHovered || imagesToShow.length <= 1) return;

        // Auto-slide when hovering and has multiple images
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % imagesToShow.length);
        }, 1500); // 1.5 seconds per slide

        return () => {
            clearInterval(interval);
        };
    }, [isHovered, imagesToShow.length]);

    // Reset to first slide when not hovering
    useEffect(() => {
        if (!isHovered) {
            setCurrentSlide(0);
        }
    }, [isHovered]);

    if (!imagesToShow || imagesToShow.length === 0) {
        return (
            <Link href={product.default_url ? route('products.show', product.default_url.slug) : '#'}>
                <div className="group transition-colors duration-200">
                    <AspectRatio ratio={2 / 3}>
                        <div className="flex h-full w-full items-center justify-center rounded-sm bg-gray-200">
                            <span className="text-gray-400">No Image</span>
                        </div>
                    </AspectRatio>
                    <div className="flex h-32 flex-col justify-between px-4 py-4">
                        <p className="line-clamp-2 text-lg font-medium">{product.attribute_data?.name.en}</p>
                        <div className="flex space-x-2">
                            {formattedComparePrice && <p className="text-sm text-gray-500 line-through">{formattedComparePrice}</p>}
                            <p className="text-lg font-semibold">{formattedPrice}</p>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={product.default_url ? route('products.show', product.default_url.slug) : '#'}>
            <div className="group transition-colors duration-200" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <div className="relative overflow-hidden rounded-sm">
                    <AspectRatio ratio={2 / 3}>
                        {/* Show slideshow only when hovering and has multiple images */}
                        {isHovered && imagesToShow.length > 1 ? (
                            <div className="h-full w-full">
                                {/* Show only the current slide */}
                                {imagesToShow.map((image, index) => (
                                    <div 
                                        key={`${image.id}-${index}`}
                                        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
                                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    >
                                        <img
                                            src={image.original_url}
                                            alt={image.file_name || product.attribute_data?.name.en}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Default thumbnail when not hovering */
                            <img
                                src={defaultThumbnail?.original_url}
                                alt={defaultThumbnail?.file_name || product.attribute_data?.name.en}
                                className="h-full w-full object-cover object-center"
                            />
                        )}
                    </AspectRatio>

                    {/* Slide indicators - only show when hovering and has multiple images */}
                    {isHovered && imagesToShow.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-1 opacity-100 transition-opacity duration-200">
                            {imagesToShow.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
                                        index === currentSlide ? 'bg-white' : 'bg-white/50'
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault(); 
                                        setCurrentSlide(index);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex h-32 flex-col justify-between px-4 py-4">
                    <p className="line-clamp-2 text-lg font-medium">{product.attribute_data?.name.en}</p>
                    <div className="flex space-x-2">
                        {formattedComparePrice && <p className="text-sm text-gray-500 line-through">{formattedComparePrice}</p>}    
                        <p className="text-lg font-semibold">{formattedPrice}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;