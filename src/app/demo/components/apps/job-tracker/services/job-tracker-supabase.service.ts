import { Injectable } from '@angular/core';
import {AuthSession, createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../../../../../environments/environment";
import {JobApplication} from "../models/job-application";

@Injectable({
  providedIn: 'root'
})
export class JobTrackerSupabaseService {

  private supabase: SupabaseClient;
  _session: AuthSession | null = null

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get session() {
    this.supabase.auth.getSession().then(({data}) => {
      this._session = data.session
    })
    return this._session
  }

  // Fetch all job applications
  async getJobs(): Promise<JobApplication[]> {
    let { data, error } = await this.supabase
        .from('tb_job_applications')
        .select('*');

    if (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
    return data as JobApplication[];
  }

  // Add a new job application
  async addJob(job: JobApplication): Promise<JobApplication | null> {
    const { data, error } = await this.supabase
        .from('tb_job_applications')
        .insert([job])
        .select()
        .single();

    if (error) {
      console.error('Error adding job:', error);
      return null;
    }
    return data as JobApplication;
  }

  // Update an existing job application
  async updateJob(pk: number, updatedJob: Partial<JobApplication>): Promise<JobApplication | null> {
    const { data, error } = await this.supabase
        .from('tb_job_applications')
        .update(updatedJob)
        .eq('pk', pk)
        .select()
        .single();

    if (error) {
      console.error('Error updating job:', error);
      return null;
    }
    return data as JobApplication;
  }

  // Delete a job application
  async deleteJob(pk: number): Promise<void> {
    const { error } = await this.supabase
        .from('tb_job_applications')
        .delete()
        .eq('pk', pk);

    if (error) {
      console.error('Error deleting job:', error);
    }
  }

}
