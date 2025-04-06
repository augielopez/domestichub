import {Tag} from "./tag";

export interface Certification {
    // DB fields
    id?: string;
    user_id?: string;
    certification_name: string;
    issuing_organization: string;
    issue_date: Date | null;
    expiration_date: Date | null;
    details: string;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;

    // UI-only field
    tags?: Tag[];
}

export interface CertificationTag {
    certification_id: string;
    tag_id: string;
}