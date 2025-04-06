import {Tag} from "./tag";

export interface Education {
    id?: string;
    user_id?: string;
    school: string;
    degree: string;
    start_year?: number | null;
    end_year?: number | null;
    gpa?: number | null;
    details?: string;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;

    // UI-only field
    tags?: Tag[];
}
