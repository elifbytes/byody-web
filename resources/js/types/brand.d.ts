import { Collection } from "./collection";
import { Discount } from "./discount";

export type Brand = {
    id: number;
    name: string;
    collections?: Collection[];
    discounts?: Discount[];
}