import { CartLine } from '@/types/cart';
import { CastedPrice } from '@/types/price';
import { ProductVariant } from '@/types/product';

const currency = import.meta.env.VITE_APP_CURRENCY || 'USD';

export function formatPrice(price?: CastedPrice) {
    if (!price || !price.currency) {
        return '-';
    }
    const currency = price.currency?.code || 'USD';
    const decimalPlaces = price.value / Math.pow(10, price.currency.decimal_places || 0);

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        notation: 'standard',
        maximumFractionDigits: 2,
    }).format(decimalPlaces);
}

export const getProductVariantPrice = (productVariant?: ProductVariant): string => {
    if (!productVariant) return '-';
    if (!productVariant.prices || productVariant.prices.length === 0) {
        return '-';
    }

    const price = productVariant.prices.find((p) => p.price.currency?.code === String(currency));
    
    if (price) {
        return formatPrice(price.price);
    }

    return '-';
};

export const getCartLinesPrice = (lines: CartLine[]): string => {
    if (!lines || lines.length === 0) return '-';

    const total = lines.reduce((sum, line) => {
        const value = line.purchasable?.prices?.find((p) => p.currency?.code === currency)?.price?.value || 0;
        const quantity = line.quantity || 1;
        return sum + value * quantity;
    }, 0);

    const firstCurrency = lines[0].purchasable?.prices?.[0]?.currency;
    if (!firstCurrency) return '-';

    const price: CastedPrice = {
        value: total,
        currency: firstCurrency,
    };

    return formatPrice(price);
};
