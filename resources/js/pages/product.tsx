import { Button, buttonVariants } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Media } from '@/types/media';
import { Product, ProductOption, ProductOptionValue, ProductVariant } from '@/types/product';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

interface ProductPageProps {
    product: Product;
}
function ProductPage({ product }: ProductPageProps) {
    const { auth } = usePage<SharedData>().props;
    const [selectedMedia, setSelectedMedia] = useState<Media | undefined>(product.media?.[0]);
    const [selectedValues, setSelectedValues] = useState<ProductOptionValue[]>();
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();

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

    useEffect(() => {
        // Find the selected variant based on the selected values
        const matchingVariant = product.variants?.find((variant) => {
            return variant.values?.every((v) => selectedValues?.some((selectedValue) => selectedValue.id === v.id));
        });
        setSelectedVariant(matchingVariant);

        // find the media that matches the selected variant
        const matchingMedia = matchingVariant?.images?.[0];
        if (matchingMedia) setSelectedMedia(matchingMedia);

        return () => {};
    }, [selectedValues, product.variants, product.media]);

    return (
        <AppLayout>
            <div className="container mx-auto grid gap-8 p-4 md:grid-cols-2">
                <div className="grid gap-3">
                    {selectedMedia && <img src={selectedMedia.original_url} alt={product.attribute_data?.name.en} className="h-auto w-full" />}
                    <div className="grid grid-cols-6 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {product.media?.map((media) => (
                            <img
                                key={media.id}
                                src={media.original_url}
                                alt={media.file_name}
                                className="h-auto w-full hover:cursor-pointer"
                                onClick={() => setSelectedMedia(media)}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{product.attribute_data?.name.en}</h1>
                    <p className="text-lg font-semibold">{product.price}</p>
                    {productOptions.map((option) => (
                        <div key={option.id} className="mt-4">
                            <h2 className="text-lg font-semibold">{option.name.en}</h2>
                            <div className="grid grid-cols-3 gap-2 lg:grid-cols-4">
                                {option.values?.map((value) => (
                                    <Toggle
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
                    {auth.user ? (
                        <Button className="mt-4 w-full rounded" disabled={!selectedVariant}>
                            Add to Cart
                        </Button>
                    ) : (
                        <Link className={buttonVariants({ className: 'mt-4 w-full' })} href={route('login')}>
                            Please log in to add to cart
                        </Link>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

export default ProductPage;
