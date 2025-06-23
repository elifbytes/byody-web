export type Media = {
    id: number;
    model_type: string;
    model_id: number;
    uuid?: string;
    collection_name: string;
    name: string;
    file_name: string;
    mime_type?: string;
    disk: string;
    conversions_disk?: string;
    size: number;
    manipulations?: string;
    custom_properties?: string;
    responsive_images?: string;
    order_column?: number;
    original_url?: string;
}