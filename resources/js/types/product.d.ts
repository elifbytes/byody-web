import { Language } from '.';
import { AttributeData } from './attribute';
import { Media } from './media';
import { Price } from './price';
import { Url } from './url';

export type Product = {
    id: number;
    product_type_id: number;
    status: string;
    attribute_data?: AttributeData;
    brand_id?: number;
    record_title?: string;
    product_type?: ProductType;
    variants?: ProductVariant[];
    variant?: ProductVariant;
    has_variants: boolean;
    media?: Media[];
    product_options?: ProductOption[];
    thumbnail?: Media;
    prices?: Price[];
    decimal_price?: number;
    default_url?: Url;
};

export type ProductType = {
    id: number;
    name: string;
};

export type ProductVariant = {
    id: number;
    product_id: number;
    tax_class_id: number;
    tax_ref?: string;
    unit_quantity: number;
    sku?: string;
    gtin?: string;
    mpn?: string;
    ean?: string;
    length_value?: number;
    length_unit?: string;
    width_value?: number;
    width_unit?: string;
    height_value?: number;
    height_unit?: string;
    weight_value?: number;
    weight_unit?: string;
    volume_value?: number;
    volume_unit?: string;
    shippable: boolean;
    stock: number;
    backorder: number;
    purchasable: boolean;
    attribute_data?: AttributeData;
    quantity_increment: number;
    min_quantity: number;
    images?: Media[];
    values?: ProductOptionValue[];
    product?: Product;
    prices?: Price[];
};

export type ProductOption = {
    id: number;
    name: Language;
    handle: string;
    label: Language;
    shared: boolean;
    values?: ProductOptionValue[];
};

export type ProductOptionValue = {
    id: number;
    product_option_id: number;
    name: Language;
    position: number;
    option?: ProductOption;
}