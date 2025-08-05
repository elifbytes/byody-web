export type Review = {
    id: number;
    order_id: number;
    user_id: number;
    customer_name: string;
    rating: number;
    comment: string;
    is_approved: boolean;
    approved_at?: string;
    approved_by?: number;
    created_at: string;
    updated_at: string;
};