export type Discount = {
    id: number;
    name: string;
    handle: string;
    coupon?: string;
    type: string;
    starts_at: string;
    ends_at?: string;
    uses: number;
    max_uses?: number;
    priority: number;
    stop: boolean;
    restriction?: string;
    data?: string;
    max_uses_per_user?: number;
}