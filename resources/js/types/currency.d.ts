export type Currency = {
    id: number;
    code: string;
    name: string;
    exchange_rate: number;
    decimal_places: number;
    enabled: boolean;
    default: boolean;
}