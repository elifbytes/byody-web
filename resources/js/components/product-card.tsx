import { formatPrice } from '@/lib/price';
import { Product } from '@/types/product';
import { Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { AspectRatio } from './ui/aspect-ratio';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from './ui/carousel';

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {
    const [carousel, setCarousel] = useState<CarouselApi>();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const formattedPrice = formatPrice(product.variants?.[0].prices?.[0].price);
    const formattedComparePrice =
        product.variants?.[0].prices?.[0].compare_price?.value !== 0 ? formatPrice(product.variants?.[0].prices?.[0].compare_price) : null;

    // Collect all variant images with useMemo to prevent re-renders
    const imagesToShow = useMemo(() => {
        const variantImages = product.variants?.flatMap((variant) => variant.images || []) || [];

        // Debug log to see what images are available
            // if (product.attribute_data?.name.en?.includes('Chuck 70')) {
            //     console.log('Chuck 70 Debug:', {
            //         productName: product.attribute_data?.name.en,
            //         variantImages: variantImages,
            //         productMedia: product.media,
            //         thumbnail: product.thumbnail,
            //         variants: product.variants,
            //     });
            // }

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

    useEffect(() => {
        if (!carousel || !imagesToShow || imagesToShow.length <= 1) return;

        // Only auto-slide when hovering and has multiple images
        const interval = setInterval(() => {
            if (isHovered && imagesToShow.length > 1) {
                carousel.scrollNext();
            }
        }, 1500); // Faster slideshow on hover (1.5 seconds)

        // Update current slide index
        const handleSelect = () => {
            setCurrentSlide(carousel.selectedScrollSnap());
        };

        carousel.on('select', handleSelect);

        return () => {
            clearInterval(interval);
            carousel.off('select', handleSelect);
        };
    }, [carousel, imagesToShow, isHovered]);

    // Reset carousel to first image when not hovering
    useEffect(() => {
        if (!isHovered && carousel && imagesToShow.length > 1) {
            carousel.scrollTo(0);
        }
    }, [isHovered, carousel, imagesToShow]);

    if (!imagesToShow || imagesToShow.length === 0) {
        return (
            <Link href={product.default_url ? route('products.show', product.default_url.slug) : '#'}>
                <div className="group transition-colors duration-200 hover:bg-gray-100">
                    <AspectRatio ratio={4 / 5}>
                        <div className="flex h-full w-full items-center justify-center rounded-sm bg-gray-200">
                            <span className="text-gray-400">No Image</span>
                        </div>
                    </AspectRatio>
                    <div className="flex h-28 flex-col justify-between px-3 py-3">
                        <p className="line-clamp-2 text-base">{product.attribute_data?.name.en}</p>
                        <div className="flex space-x-2">
                            {formattedComparePrice && <p className="text-sm text-gray-500 line-through">{formattedComparePrice}</p>}
                            <p className="text-base font-medium">{formattedPrice}</p>
                        </div>
                    </div>
                </div>
                </Link>
        );
    }

    return (
        <Link href={product.default_url ? route('products.show', product.default_url.slug) : '#'}>
            <div
                className="group transition-colors duration-200 hover:bg-gray-100"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative">
                    <AspectRatio ratio={4 / 5}>
                        {/* Show slideshow only when hovering and has multiple images */}
                        {isHovered && imagesToShow.length > 1 ? (
                            <Carousel setApi={setCarousel} opts={{ loop: true }}>
                                <CarouselContent>
                                    {imagesToShow.map((image, index) => (
                                        <CarouselItem key={`${image.id}-${index}`}>
                                            <img
                                                src={image.original_url}
                                                alt={image.file_name || product.attribute_data?.name.en}
                                                className="h-full w-full rounded-sm object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                        ) : (
                            /* Default thumbnail when not hovering */
                            <img
                                src={defaultThumbnail?.original_url}
                                alt={defaultThumbnail?.file_name || product.attribute_data?.name.en}
                                className="h-full w-full rounded-sm object-cover transition-transform duration-300 group-hover:scale-105"
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
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex h-20 flex-col justify-between px-2 py-1">
                    <p className="line-clamp-2">{product.attribute_data?.name.en}</p>
                    <div className="flex space-x-2">
                        {formattedComparePrice && <p className="text-sm text-gray-500 line-through">{formattedComparePrice}</p>}
                        <p className="text-sm font-medium">{formattedPrice}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
