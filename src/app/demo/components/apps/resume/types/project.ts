import {Tag} from "./tag";

export interface Project {
    id?: string;
    user_id?: string;
    name: string;
    description: string;
    technologies: string;
    url: string;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;

    // UI-only field
    tags?: Tag[];
}

export interface ProjectTag {
    project_id: string;
    tag_id: string;
}

export interface ProjectTechnology {
    id?: string;
    project_id: string;
    technology_name: string;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
}

