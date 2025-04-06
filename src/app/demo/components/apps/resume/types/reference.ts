import {Tag} from "./tag";

export interface Reference {
    id?: string;
    user_id?: string;
    reference_name: string;
    relationship?: string;
    contact_info?: string;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;

    // UI-only field
    tags?: Tag[];
}
