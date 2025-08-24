export interface ShippingOption {
    currency:         string;
    vendor_name:      string;
    service_name:     string;
    service:          ShippingService;
    image:            string;
    goods:            Good[];
    lead_time:        string;
    price:            number;
    subtotal:         number;
    insurance_value:  number;
    insurance_fee:    number;
    origin_code:      DestinationCodeClass | string;
    destination_code: DestinationCodeClass | string;
    response_time:    number;
    surcharge:        number;
}

export interface DestinationCodeClass {
    id:            string;
    state_name:    string;
    regency_name:  string;
    district_name: string;
    code:          string;
    district_id:   string;
}

export interface Good {
    goods_name:    string;
    goods_type:    string;
    qty:           number;
    weight:        number;
    vol_longth:    number;
    vol_width:     number;
    vol_height:    number;
    vol_weight:    number;
    billed_weight: number;
    price:         number;
    lead_time:     string;
}

export interface ShippingService {
    id:                 string;
    name:               string;
    discount_corporate: number;
    discount_personal:  number;
    discount_outlet:    number;
}
