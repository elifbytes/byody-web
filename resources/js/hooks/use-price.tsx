import { SharedData } from '@/types';
import { CartLine } from '@/types/cart';
import { CastedPrice } from '@/types/price';
import { ProductVariant } from '@/types/product';
import { usePage } from '@inertiajs/react';

export function usePrice() {
    const { exchangeRate, currency } = usePage<SharedData>().props;

    const getValue = (value: number | string | undefined, defaultValue: number): number => {
        if (!value) {
            return defaultValue;
        }
        return Math.round(Number(value) / (exchangeRate || 1));
    }

    const formatPrice = (price?: CastedPrice): string => {
        if (!price) {
            return '-';
        }

        const value = price.value / (exchangeRate || 1);

        if (currency === 'IDR') {
            return `Rp${value.toLocaleString('id-ID')}`;
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            notation: 'standard',
            maximumFractionDigits: 2,
        }).format(value);
    };

    const getProductVariantPrice = (productVariant?: ProductVariant): string => {
        if (!productVariant) return '-';
        if (!productVariant.prices || productVariant.prices.length === 0) {
            return '-';
        }

        const price = productVariant.prices.find((p) => p.price.currency?.code === 'IDR');

        if (price) {
            return formatPrice(price.price);
        }

        return '-';
    };

    const getCartLinesPrice = (lines: CartLine[]): string => {
        if (!lines || lines.length === 0) return '-';

        const total = lines.reduce((sum, line) => {
            const value = line.purchasable?.prices?.find((p) => p.price.currency?.code === 'IDR')?.price?.value || 0;
            const quantity = line.quantity || 1;
            return sum + value * quantity;
        }, 0);

        const firstCurrency = lines[0].purchasable?.prices?.[0]?.price.currency;
        if (!firstCurrency) return '-';

        const price: CastedPrice = {
            value: total,
            currency: firstCurrency,
        };

        return formatPrice(price);
    };

    return {
        getValue,
        exchangeRate,
        formatPrice,
        getProductVariantPrice,
        getCartLinesPrice,
    };
}
