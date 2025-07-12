import { AttributeData } from "./attribute";
import { Brand } from "./brand";
import { CustomerGroup } from "./customer";
import { Discount } from "./discount";
import { Media } from "./media";
import { Product } from "./product";
import { Url } from "./url";

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
    default_url?: Url;
    thumbnail?: Media;
    children?: Collection[];
}

export type CollectionGroup = {
    id: number;
    name: string;
    handle: string;
}