import { Experience } from './experience';
import { Project } from './project';
import { Certification } from './certification';
import {User} from "./user";
import {Education} from "./education";
import {Skill} from "./skill";
import {Language} from "./language";
import {Note} from "./note";
import {Reference} from "./reference";
import {Summary} from "./summary";
import {PersonalInformation} from "./personal-information";


export interface Resume {
    id?: string;
    title: string; // default: "Main"
    user: User;
    personal_info: PersonalInformation;
    summary: Summary;
    skills: Skill[];
    education: Education[];
    experience: Experience[];
    projects: Project[];
    certifications: Certification[];
    languages: Language[];
    references: Reference[];
    notes: Note[];
}

export interface Section {
    id?: string;
    saved_id: string;

    skill_id?: string;
    project_id?: string;
    education_id?: string;
    experience_id?: string;
    certification_id?: string;
    language_id?: string;
    reference_id?: string;
    summary_id?: string;
    note_id?: string;

    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
}


export interface SavedResume {
    id?: string;
    user_id: string;
    resume_name: string;
    main_resume_id: string;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
}

