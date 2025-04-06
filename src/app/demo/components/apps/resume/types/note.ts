import {Tag} from "./tag";

export interface Note {
    id?: string;
    user_id?: string;
    note: string;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;

    // UI-only field
    tags?: Tag[];
}

