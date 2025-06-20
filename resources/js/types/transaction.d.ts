export type Transaction = {
    id: number;
    order_id: number;
    success: boolean;
    driver: string;
    amount: number;
    reference: string;
    status: string;
    notes?: string;
    card_type?: string;
    last_four?: string;
    meta?: string;
    parent_transaction_id?: number;
    captured_at?: string;
    type: string;
}