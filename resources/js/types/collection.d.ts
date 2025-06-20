import { AttributeData } from "./attribute";
import { Brand } from "./brand";
import { CustomerGroup } from "./customer";
import { Discount } from "./discount";
import { Product } from "./product";

export type Collection = {
    id: number;
    collection_group_id: number;
    _lft: number;
    _rgt: number;
    parent_id?: number;
    type: string;
    attribute_data?: AttributeData;
    sort: string;
    group: CollectionGroup;
    discounts?: Discount[];
    brands?: Brand[];
    customer_groups?: CustomerGroup[];
    products?: Product[];
}

export type CollectionGroup = {
    id: number;
    name: string;
    handle: string;
}