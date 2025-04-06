import {Tag} from "./tag";

export interface Experience {
    id?: string;
    user_id?: string;
    job_title: string;
    company: string;
    start_date: Date | null;
    end_date: Date | null;
    employment_type: string;
    location: string;
    location_type: string;
    is_current: boolean;
    description: string;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;

    bullets: ExperienceBullet[];
}


export interface ExperienceBullet {
    id?: string;
    experience_id: string;
    description: string;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;

    // UI-only field
    tags?: Tag[];
}

export interface ExperienceBulletTag {
    experience_bullet_id: string;
    tag_id: string;
}

