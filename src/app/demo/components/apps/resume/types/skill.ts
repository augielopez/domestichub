import {Tag} from "./tag";

export interface Skill {
    id?: string;
    user_id?: string;
    name: string;
    proficiency_level?: string;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;

    // UI-only field
    tags?: SkillTag[];
}

export interface SkillTag {
    skill_id: string;
    tag_id: string;
}
