import { Injectable } from '@angular/core';
import {AuthSession, createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../../../../../environments/environment";
import {AccountModel, AccountDto} from "../models/account.model";
import {TypeService} from "../../bills/service/type.service";
import {childType, parentType} from "../../bills/models/bill";
import {from, Observable} from "rxjs";
import {BillsService} from "../../bills/service/bills.service";

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
        password: '',
        is_bill: false
    };

    constructor(private typeService: TypeService, private billService: BillsService) {
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

        let { data: accounts, error } = await this.supabase
            .from('vw_accounts')
            .select('*');

        if (accounts) {
            for (const data of accounts) {
                const bill = await this.billService.getBillByAccountId(data.account_pk); // Await the Promise
                const account: AccountDto = {
                    account_pk: data.account_pk,
                    account_name: data.account_name,
                    url: data.url,
                    owner_pk: data.owner_pk,
                    owner_name: data.owner_name,
                    login_pk: data.login_pk,
                    username: data.username,
                    password: data.password,
                    is_bill: !!bill, // Converts the returned value to a boolean
                };

                this.accounts.push(account); // Add the processed account to the array
            }
        }

        return this.accounts.sort((a, b) => (a.account_name > b.account_name ? 1 : -1));
    }

    getAccount(id: any): Observable<AccountModel> {
        return from(
            this.supabase
                .from('tb_accounts')
                .select('*')
                .eq('pk', id)
                .then(({ data: account, error }) => {
                    if (error) {
                        console.log('Error getting data:', error.message);
                        throw error; // Ensure errors propagate
                    }
                    console.log('Data read successfully:', account);
                    return account![0] as AccountModel; // Explicitly cast the result
                })
        );
    }

    async getAccountDto(pk: number) {
        let {data: account, error} = await this.supabase
            .from('vw_accounts')
            .select('*')
            .eq('account_pk', pk);

        this.account = account![0];

        return this.account
    }

    updateAccount(value: any): Observable<any> {
        return from(
            this.supabase
                .from('accounts')
                .update({
                    name: value.name,
                    url: value.url,
                    ownerpk: value.ownerpk,
                    loginpk: value.loginpk,
                    updatedby: 'UI',
                    updatedon: new Date(),
                })
                .eq('pk', value.billspk)
                .then(({ data, error }) => {
                    if (error) {
                        console.log('Error updating data:', error.message);
                        throw error; // Throw error to propagate it up
                    }
                    console.log('Data updated successfully:', data);
                    return data; // Return the data if the update was successful
                })
        );
    }

    createAccount(accountData: Partial<AccountDto>): Observable<AccountDto> {
        return from(
            this.supabase
                .from('tb_accounts')
                .insert([
                    {
                        account_name: accountData.account_name,
                        url: accountData.url,
                        owner_pk: accountData.owner_pk,
                        owner_name: accountData.owner_name,
                        login_pk: accountData.login_pk,
                        username: accountData.username,
                        password: accountData.password,
                        createdby: 'UI',           // Assuming 'createdby' is required
                        createdon: new Date()      // Assuming 'createdon' is required
                    },
                ])
                .select()
                .then(({ data, error }) => {
                    if (error) {
                        console.log('Error creating account:', error.message);
                        throw error; // Propagate the error
                    }
                    console.log('Account created successfully:', data);
                    return data![0] as AccountDto; // Return the created account as AccountDto
                })
        );
    }
}
