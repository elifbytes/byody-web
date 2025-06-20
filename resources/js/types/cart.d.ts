import { User } from '.';
import { Country } from './country';
import { Currency } from './currency';
import { Customer } from './customer';
import { Discount } from './discount';

export type Cart = {
    id: number;
    user_id?: number;
    merged_id?: number;
    currency_id: number;
    channel_id: number;
    order_id?: number;
    coupon_code?: string;
    completed_at?: string;
    meta?: string;
    customer_id?: number;
    user?: User;
    lines?: CartLine[];
    currency?: Currency;
    customer?: Customer;
    addresses?: CartAddress[];
    shipping_address?: CartAddress;
    billing_address?: CartAddress;
};

export type CartLine = {
    id: number;
    cart_id: number;
    purchasable_type: string;
    purchasable_id: number;
    quantity: number;
    meta?: string;
    discounts?: Discount[];
};

export type CartAddress = {
    id: number;
    cart_id?: number;
    country_id?: number;
    title?: string;
    first_name: string;
    last_name: string;
    company_name?: string;
    line_one: string;
    line_two?: string;
    line_three?: string;
    city: string;
    state?: string;
    postcode: string;
    delivery_instructions?: string;
    contact_email?: string;
    contact_phone?: string;
    type: string;
    shipping_option?: string;
    meta?: string;
    country?: Country;
};
