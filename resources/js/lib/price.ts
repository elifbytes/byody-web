import { CartLine } from '@/types/cart';
import { ProductVariant } from '@/types/product';

export const getProductVariantPrice = (productVariant?: ProductVariant): string => {
    if (!productVariant) return '-';
    if (!productVariant.prices || productVariant.prices.length === 0) {
        return '-';
    }

    const price = productVariant.prices[0];
    if (price.price && price.price.value !== undefined) {
        const decimalPlaces = price.price.currency?.decimal_places || 1;
        const factor = Math.pow(10, decimalPlaces);
        return '$' + (price.price.value / factor).toFixed(decimalPlaces);
    }

    return '-';
};

export const getCartLinesPrice = (lines: CartLine[]): string => {
    if (!lines || lines.length === 0) return '-';
    
    const total = lines.reduce((sum, line) => {
        const value = line.purchasable?.prices?.[0]?.price?.value || 0;
        const quantity = line.quantity || 1;
        return sum + (value * quantity);
    }, 0);

    const decimalPlaces = lines[0].purchasable?.prices?.[0]?.price?.currency?.decimal_places || 1;
    const factor = Math.pow(10, decimalPlaces);
    return '$' + (total / factor).toFixed(decimalPlaces);
}