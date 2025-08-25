import { CastedPrice } from "./price";
import { TaxClass } from "./tax";

export type ShippingOption = {
    name: string;
    description?: string;
    identifier: string;
    price: CastedPrice;
    taxClass: TaxClass;
    taxReference?: string;
    option: string;
    collect: boolean;
    meta?: Record<string, string>;
};
