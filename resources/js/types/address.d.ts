import { Country } from "./country";

export type Address = {
    id: number;
    customer_id?: number;
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
    postcode?: string;
    delivery_instructions?: string;
    contact_email?: string;
    contact_phone?: string;
    meta?: string;
    shipping_default: boolean;
    billing_default: boolean;
    country?: Country;
}