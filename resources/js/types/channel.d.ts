import { Collection } from "./collection";
import { Discount } from "./discount";

export type Channel = {
    id: number;
    name: string;
    handle: string;
    default: boolean;
    url?: string;
    discounts?: Discount[];
    collections?: Collection[];
};

export type Channelable = {
    id: number;
    channel_id: number;
    channelable_type: string;
    channelable_id: number;
    enabled: boolean;
    starts_at?: string;
    ends_at?: string;
}