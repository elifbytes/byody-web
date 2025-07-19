import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import ProductsCarousel from '@/components/products-carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button, buttonVariants } from '@/components/ui/button';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import { formatPrice } from '@/lib/price';
import { Product, ProductOption, ProductOptionValue, ProductVariant } from '@/types/product';
import { Link, useForm } from '@inertiajs/react';
import parse from 'html-react-parser';
import { CheckCircle2, Minus, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface ShowProductPageProps {
    product: Product;
    bestSellers: Product[];
}
function ShowProductPage({ product, bestSellers }: ShowProductPageProps) {
    const prices = product.variants?.[0]?.prices;
    const price = prices?.[0]?.price;
    const comparePrice = prices?.[0]?.compare_price;

    const [carousel, setCarousel] = useState<CarouselApi>();
    const [carouselIndex, setCarouselIndex] = useState<number>(0);
    const [selectedValues, setSelectedValues] = useState<ProductOptionValue[]>();
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();
    const [quantity, setQuantity] = useState<number>(1);

    const { post, processing, errors, transform } = useForm({
        product_variant_id: selectedVariant?.id,
        quantity: quantity,
    });

    const onThumbClick = (index: number) => {
        if (!carousel) return;
        carousel.scrollTo(index);
    };

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        // Transform the form data to include selected variant and quantity
        transform((data) => ({
            ...data,
            product_variant_id: selectedVariant.id,
            quantity: quantity,
        }));
        post(route('carts.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setQuantity(1); // Reset quantity after adding to cart
                setSelectedValues([]); // Clear selected values
                setSelectedVariant(undefined); // Clear selected variant
                toast.success('Product added to cart successfully!');
            },
            onError: (error) => {
                console.error('Error adding to cart:', error);
                toast.error('Failed to add product to cart. Please try again.');
            },
        });
    };

    const productOptions: ProductOption[] = useMemo(() => {
        const optionsMap = new Map<number, ProductOption>();
        for (const variant of product.variants || []) {
            for (const value of variant.values || []) {
                if (!optionsMap.has(value.product_option_id)) {
                    const option = value.option;
                    if (option) {
                        // Clone to avoid mutating original
                        optionsMap.set(option.id, { ...option, values: [] });
                    }
                }
                const option = optionsMap.get(value.product_option_id);
                if (option) {
                    option.values = option.values || [];
                    if (!option.values.some((v) => v.id === value.id)) {
                        option.values.push(value);
                    }
                }
            }
        }
        return Array.from(optionsMap.values());
    }, [product.variants]);

    const handleSelectValue = (value: ProductOptionValue) => {
        const existingValueIndex = selectedValues?.findIndex((v) => v.id === value.id);
        if (existingValueIndex !== undefined && existingValueIndex >= 0) {
            // If the value is already selected, remove it
            setSelectedValues((prev) => prev?.filter((_, index) => index !== existingValueIndex));
        } else {
            // check if product_option_id is already selected
            const isOptionAlreadySelected = selectedValues?.some((v) => v.product_option_id === value.product_option_id);
            if (isOptionAlreadySelected) {
                // If the option is already selected, remove all values of that option
                setSelectedValues((prev) => prev?.filter((v) => v.product_option_id !== value.product_option_id));
            }
            // Otherwise, add the new value
            setSelectedValues((prev) => [...(prev || []), value]);
        }
    };

    const handleSlideChange = useCallback((carousel: CarouselApi) => {
        setCarouselIndex(carousel?.selectedScrollSnap() || 0);
    }, []);

    useEffect(() => {
        if (carousel) carousel.on('select', handleSlideChange);
    }, [carousel, handleSlideChange]);

    useEffect(() => {
        // Find the selected variant based on the selected values
        const matchingVariant = product.variants?.find((variant) => {
            return variant.values?.every((v) => selectedValues?.some((selectedValue) => selectedValue.id === v.id));
        });
        setSelectedVariant(matchingVariant);

        // find the media that matches the selected variant
        const matchingMediaIndex = product.media?.findIndex((media) => {
            return media.id === matchingVariant?.id;
        });

        if (matchingMediaIndex !== undefined && matchingMediaIndex >= 0 && carousel) {
            carousel.scrollTo(matchingMediaIndex);
            setCarouselIndex(matchingMediaIndex);
        }

        return () => {};
    }, [selectedValues, product.variants, product.media, carousel]);

    return (
        <AppLayout>
            <div className="container mx-auto grid gap-8 p-4 md:grid-cols-2">
                <div className="grid gap-3">
                    <Carousel setApi={setCarousel} opts={{ loop: true }}>
                        <CarouselContent>
                            {product.media?.map((media) => (
                                <CarouselItem key={media.id}>
                                    <img src={media.original_url} alt={media.file_name} className="h-full w-full object-cover" />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <div className="grid grid-cols-6 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {product.media?.map((media, index) => (
                            <div className="relative h-20 w-full" key={media.id}>
                                <AspectRatio ratio={1 / 1}>
                                    <img
                                        src={media.original_url}
                                        alt={media.file_name}
                                        className="h-auto w-full hover:cursor-pointer"
                                        onClick={() => onThumbClick(index)}
                                    />
                                </AspectRatio>
                                {carouselIndex === index && (
                                    // add a check icon to indicate the selected thumbnail to the center of the thumbnail
                                    <CheckCircle2 className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-background/50" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{product.attribute_data?.name.en}</h1>
                    <div className="flex items-center space-x-2">
                        {comparePrice && comparePrice.value > 0 && <p className="text-sm text-gray-500 line-through">{formatPrice(comparePrice)}</p>}
                        <p className="text-lg font-semibold">{formatPrice(price)}</p>
                    </div>
                    {productOptions.map((option) => (
                        <div key={option.id} className="mt-4">
                            <h2 className="text-lg font-semibold">{option.name.en}</h2>
                            <div className="grid grid-cols-3 gap-2 lg:grid-cols-4">
                                {option.values?.map((value) => (
                                    <Toggle
                                        variant="outline"
                                        key={value.id}
                                        pressed={selectedValues?.some((v) => v.id === value.id) || false}
                                        onPressedChange={() => handleSelectValue(value)}
                                    >
                                        {value.name.en}
                                    </Toggle>
                                ))}
                            </div>
                        </div>
                    ))}
                    {selectedVariant && (
                        <div className="mt-4">
                            <h2 className="font-semibold">Selected Variant</h2>
                            <p className="text-sm">SKU: {selectedVariant.sku}</p>
                            <p className="text-sm text-muted-foreground">Stock: {selectedVariant.stock}</p>
                        </div>
                    )}
                    <div className="mt-4 flex items-center justify-center">
                        <Button disabled={!selectedVariant} onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <div className="mx-10">{quantity}</div>
                        <Button disabled={!selectedVariant} onClick={() => setQuantity((prev) => Math.min(prev + 1, selectedVariant?.stock || 1))}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <LoadingButton className="mt-4 w-full rounded" loading={processing} onClick={handleAddToCart}>
                        Add to Cart
                    </LoadingButton>
                    <LoadingButton 
                        style={{ backgroundColor: '#F97316' }}
                        className={buttonVariants({ className: 'mt-4 w-full' })}
                        loading={processing}
                        onClick={() => {
                            if (!selectedVariant) return;
                            // Transform the form data to include selected variant and quantity
                            transform((data) => ({
                                ...data,
                                product_variant_id: selectedVariant.id,
                                quantity: quantity,
                            }));
                            post(route('orders.direct-checkout'), {
                                onError: (error) => {
                                    console.error('Error during checkout:', error);
                                    toast.error('Failed to checkout. Please try again.');
                                },
                            });
                        }}
                    >
                        Checkout
                    </LoadingButton>
                    <InputError message={errors.product_variant_id} />
                    <InputError message={errors.quantity} />
                    <div className="mt-10">
                        <div className="prose">{product.attribute_data?.description && parse(product.attribute_data.description.en)}</div>
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <h1 className="my-5 text-center text-3xl">BEST SELLERS</h1>
                <ProductsCarousel products={bestSellers} />
            </div>
        </AppLayout>
    );
}

export default ShowProductPage;
