import { Currency } from "./currency";
import { CustomerGroup } from "./customer";

export type Price = {
    id: number;
    customer_group_id?: number;
    currency_id: number;
    priceable_type: string;
    priceable_id: number;
    price: {
        currency: Currency;
        value: number;
    };
    compare_price?: number;
    min_quantity: number;
    currency?: Currency;
    customer_group?: CustomerGroup;
    price_ex_tax?: Price;
    price_inc_tax?: Price;
    compare_price_inc_tax?: Price;
}