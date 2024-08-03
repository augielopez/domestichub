import { Injectable } from '@angular/core';
import {AuthSession, createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../../../../environments/environment";
import {Account, AccountDto} from "./account";
import {TypeService} from "../bills/service/type.service";
import {childType, parentType} from "../bills/models/bill";

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
    private supabase: SupabaseClient
    _session: AuthSession | null = null

    accounts: AccountDto[] = [];
    types: parentType[] = [];
    ownerTypes: childType[] = [];
    account: AccountDto = {
        account_pk: 0,
        account_name: '',
        url: '',
        owner_pk: 0,
        owner_name: '',
        login_pk: 0,
        username: '',
        password: ''
    };

    constructor(private typeService: TypeService) {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

        this.typeService.allTypes$.subscribe(data => {
            this.types = data;
        });
    }

    get session() {
        this.supabase.auth.getSession().then(({data}) => {
            this._session = data.session
        })
        return this._session
    }

    async getAccounts() {
        this.accounts = [];

        let {data: accounts, error} = await this.supabase
            .from('vw_accounts')
            .select('*');

        accounts?.forEach((data) => {
            const account: AccountDto = {
                account_pk: data.account_pk,
                account_name: data.account_name,
                url: data.url,
                owner_pk: data.owner_pk,
                owner_name: data.owner_name,
                login_pk: data.login_pk,
                username: data.username,
                password: data.password
            }

            this.accounts.push(account);
        });

        return this.accounts.sort((a, b) => (a.account_name > b.account_name) ? 1 : -1);
    }

    async getAccount(id: any) {
        let {data: account, error} = await this.supabase
            .from('tb_accounts')
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

    async getAccountDto(pk: number) {
        let {data: account, error} = await this.supabase
            .from('vw_accounts')
            .select('*')
            .eq('account_pk', pk);

        this.account = account![0];

        return this.account
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
