import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {User} from "./types/user";
import {AuthSession, createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../../../../environments/environment";
import {Summary} from "./types/summary";
import {PersonalInformation} from "./types/personal-information";

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private supabaseUrl = environment.supabaseUrl;
  private supabaseKey = environment.supabaseKey;
  private supabase: SupabaseClient;
  _session: AuthSession | null = null

  constructor(private http: HttpClient) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get session() {
    this.supabase.auth.getSession().then(({data}) => {
      this._session = data.session
    })
    return this._session
  }

  private getHeaders() {
    return new HttpHeaders({
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json'
    });
  }

  /** Fetch Main Resume */
  getMainResume(): Observable<any> {
    return this.http.get<any>(`${this.supabaseUrl}/rest/v1/main?select=*`, { headers: this.getHeaders() });
  }

  /** Save or Update Main Resume */
  saveMainResume(resume: any): Observable<any> {
    return this.http.post(`${this.supabaseUrl}/rest/v1/main`, resume, { headers: this.getHeaders() });
  }

  /** Fetch All Available Tags */
  getTags(): Observable<any[]> {
    return this.http.get<any[]>(`${this.supabaseUrl}/rest/v1/tags?select=*`, { headers: this.getHeaders() });
  }

  /** Fetch Saved Resumes */
  getSavedResumes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.supabaseUrl}/rest/v1/saved?select=*`, { headers: this.getHeaders() });
  }

  /** Save a Filtered Resume */
  saveFilteredResume(resumeData: any): Observable<any> {
    return this.http.post(`${this.supabaseUrl}/rest/v1/saved`, resumeData, { headers: this.getHeaders() });
  }

  /** Add a Tag */
  addTag(tag: string): Observable<any> {
    return this.http.post(`${this.supabaseUrl}/rest/v1/tags`, { tag_name: tag }, { headers: this.getHeaders() });
  }

  async updatePersonalInfo(personalInfo: PersonalInformation): Promise<{ data: any; error: any }> {
    const timestamp = new Date().toISOString();
    const currentUserId = personalInfo.user_id || crypto.randomUUID();

    if (personalInfo.id) {
      // 🔄 Update existing user
      const { data, error } = await this.supabase
          .from('resume_personal_info')
          .update({
            name: personalInfo.name,
            email: personalInfo.email,
            linkedin: personalInfo.linkedin,
            github: personalInfo.github,
            updated_at: timestamp,
            updated_by: 'Front End'
          })
          .eq('id', personalInfo.id)
          .select(); // 🛑 Add .select() to get back updated rows

      return { data, error };
    } else {
      // 🆕 Insert new user
      const { data, error } = await this.supabase
          .from('resume_personal_info')
          .insert([{
            id: currentUserId,
            user_id: '',
            name: personalInfo.name,
            email: personalInfo.email,
            linkedin: personalInfo.linkedin,
            github: personalInfo.github,
            created_at: timestamp,
            created_by: currentUserId,
            updated_at: timestamp,
            updated_by: currentUserId
          }])
          .select(); // 🛑 Required to return inserted rows

      return { data, error };
    }
  }


    async updateSummary(summary: Summary): Promise<{ data: any; error: any }> {
        const timestamp = new Date().toISOString();
        const currentUserId = summary.user_id || crypto.randomUUID(); // use auth ID if available

        if (summary.id) {
            // 🔄 Update existing summary
            const { data, error } = await this.supabase
                .from('resume_summary')
                .update({
                    summary_text: summary.summary_text,
                    updated_at: timestamp,
                    updated_by: 'Front End'
                })
                .eq('id', summary.id)
                .select(); // return updated row

            return { data, error };
        } else {
            // 🆕 Insert new summary
            const { data, error } = await this.supabase
                .from('resume_summary')
                .insert([{
                    id: currentUserId,
                    user_id: summary.user_id,
                    summary_text: summary.summary_text,
                    created_at: timestamp,
                    created_by: currentUserId,
                    updated_at: timestamp,
                    updated_by: currentUserId
                }])
                .select(); // return inserted row

            return { data, error };
        }
    }
}
