import { Language } from ".";

export type Attributable = {
    id: number;
    attributable_type: string;
    attribute_id: number;
};

export type Attribute = {
    id: number;
    attribute_type: string;
    attribute_group_id: number;
    position: number;
    name: Language;
    handle: string;
    section?: string;
    type: string;
    required: boolean;
    devault_value?: string;
    configuration: string;
    system: boolean;
    searchable: boolean;
    filterable: boolean;
    validation_rules?: string;
    description?: Language;
    attributable?: Attributable;
};

export type AttributeGroup = {
    id: number;
    attributable_type: string;
    name: Language;
    handle: string;
    position: number;
    attributes: Attribute[];
};

export type AttributeData = Record<string, Language>;
