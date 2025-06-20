import { AttributeData } from "./attribute";

export type Customer = {
    id: number;
    title?: string;
    first_name: string;
    last_name: string;
    company_name?: string;
    vat_no?: string;
    meta?: string;
    attribute_data?: string;
    account_ref?: string;
}

export type CustomerGroup = {
    id: number;
    name: string;
    handle: string;
    default: boolean;
    attribute_data?: AttributeData;
}