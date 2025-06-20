export type State = {
    id: number;
    country_id?: number;
    name: string;
    code: string;
}

export type Country = {
    id: number;
    name: string;
    iso3: string;
    iso2?: string;
    phonecode: string;
    capital?: string;
    currency: string;
    native?: string;
    emoji: string;
    emoji_u: string;
    states: State[];
}