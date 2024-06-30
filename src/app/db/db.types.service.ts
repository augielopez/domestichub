import { Injectable } from '@angular/core';
import {AuthSession, createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../environments/environment";
import {childType} from "../demo/components/apps/bills/models/bill";

@Injectable({
  providedIn: 'root'
})
export class DbTypesService {
    private supabase: SupabaseClient;
    _session: AuthSession | null = null;
    [key: string]: (() => Promise<string[]>) | SupabaseClient | AuthSession | null;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    }


}
