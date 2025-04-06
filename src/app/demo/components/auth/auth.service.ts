import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { User } from '../apps/resume/types/user'; // Adjust path as needed

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async login(username: string, pass: string): Promise<{ user: User | null; error: string | null }> {
    const { data, error } = await this.supabase
        .from('resume_users')
        .select('*')
        .eq('username', username)
        .eq('password', pass)
        .single();

    if (error) {
      return { user: null, error: 'Invalid credentials or user not found.' };
    }

    return { user: data, error: null };
  }

  async createUser(user: { username: string; email: string; password?: string }): Promise<{ data: any; error: any }> {
    const timestamp = new Date().toISOString();
    const id = crypto.randomUUID();

    const { data, error } = await this.supabase
        .from('resume_users') // assuming you're using a view
        .insert([{
          id,
          username: user.username,
          password: btoa(user.password ?? ''),
          email: user.email,
          is_active: true,
          created_at: timestamp,
          created_by: id,
          updated_at: timestamp,
          updated_by: id
        }])
        .select();

    return { data, error };
  }

}
