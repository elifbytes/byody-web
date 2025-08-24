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
    meta?: Record<string, string>;
    shipping_default: boolean;
    billing_default: boolean;
    country?: Country;
}

export type District = {
    id: string;
    regency_id: string;
    name: string;
    connecting: string;
    // regency: {
    //     id: string;
    //     country_id: string;
    //     state_id: string;
    //     name: string;
    //     regency_type: string;
    //     state: {
    //         id: string;
    //         country_id: string;
    //         name: string;
    //         country: {
    //             id: string;
    //             flag: string;
    //             iso: string;
    //             name: string;
    //             official: string;
    //             iso3: string;
    //             numcode: string;
    //             phonecode: string;
    //             currency_iso3: string;
    //             currency_name: string;
    //             currency_symbol: string;
    //         }
    //     }
    // }
}
