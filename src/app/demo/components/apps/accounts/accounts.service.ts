import { Injectable } from '@angular/core';
import {AuthSession, createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../../../../environments/environment";
import {Bill} from "../bills/models/bill";
import {Account} from "./account";

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
    private supabase: SupabaseClient
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

    async getAccount(id: any) {
        let {data: account, error} = await this.supabase
            .from('accounts')
            .select('*')
            .eq('pk', id);

        if (error) {
            console.log('Error getting data:', error.message);
        } else {
            console.log('Data read successfully:', account);
        }

        const dbaccount: Account = account![0];

        return dbaccount;
    }

    async updateAccount(value: any) {
        const {data, error} = await this.supabase
            .from('accounts')
            .update({
                Update: undefined,
                name: value.name,
                url: value.url,
                ownerpk: value.ownerpk,
                loginpk: value.loginpk,
                updatedby: 'UI',
                updatedon: new Date()
            })
            .eq('pk', value.billspk);

        if (error) {
            console.log('Error updating data:', error.message);
        } else {
            console.log('Data updated successfully:', data);
        }
    }
}
