import { Injectable } from '@angular/core';
import {AuthSession, createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../../../../../environments/environment";
import {AccountModel, VwAccount} from "../models/account.model";
import {TypeService} from "../../bills/service/type.service";
import {childType, parentType, VwRecon} from "../../bills/models/bill";
import {from, Observable} from "rxjs";
import {BillsService} from "../../bills/service/bills.service";

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
    private supabase: SupabaseClient
    _session: AuthSession | null = null

    accounts: VwAccount[] = [];
    recons: VwRecon[] = [];
    types: parentType[] = [];
    ownerTypes: childType[] = [];
    account: { isBill: boolean; accountPk: number; password: string; loginPk: number; accountName: string; ownerMame: string; ownerPk: number; url: string; username: string } = {
        accountPk: 0,
        accountName: '',
        url: '',
        ownerPk: 0,
        ownerMame: '',
        loginPk: 0,
        username: '',
        password: '',
        isBill: false
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
        this.recons = [];

        let { data: accounts, error: accountsError } = await this.supabase
            .from('vw_accounts')
            .select('*');

        const { data: recons, error: reconError } = await this.supabase
            .from('vw_recon')
            .select('*')
            .returns<VwRecon[]>();

        if (accountsError || reconError) {
            console.error(accountsError || reconError);
        }

        if (recons) {
            for (const data of recons) {
                const recon: VwRecon = {
                    account_name: data.account_name || '', // Default to empty string if undefined
                    sql: data.sql || '', // Default to empty string if undefined
                    transaction_desc: data.transaction_desc || '', // Default to empty string if undefined
                    transaction_date: data.transaction_date ? new Date(data.transaction_date) : new Date(), // Convert to Date
                    due_date: data.due_date || '', // Default to empty string if undefined
                    transaction_amount: data.transaction_amount || 0, // Default to 0
                    expected_amount: data.expected_amount || 0, // Default to 0
                    source: data.source || '', // Default to empty string
                    isfixed: data.isfixed || false, // Default to false
                    accountpk: data.accountpk || 0, // Default to 0
                    ownerpk: data.ownerpk || 0, // Default to 0
                    loginpk: data.loginpk || 0, // Default to 0
                    billpk: data.billpk || 0, // Default to 0
                    priorityfk: data.priorityfk || null, // Default to null
                    frequencyfk: data.frequencyfk || null, // Default to null
                    typefk: data.typefk || null, // Default to null
                    paymenttypefk: data.paymenttypefk || null, // Default to null
                    isincludedinmonthlypayment: data.isincludedinmonthlypayment || false, // Default to false
                    isactive: data.isactive || false, // Default to false
                };

                // Add the processed recon object to a list or process as needed
                this.recons.push(recon);
            }
        }

        this.recons.sort((a, b) => {
            return new Date(b.transaction_date) > new Date(a.transaction_date) ? 1 : -1;
        });

        if (accounts) {
            for (const data of accounts) {
                const account: VwAccount = {
                    accountpk: data.account_pk,
                    accountName: data.account_name,
                    url: data.url,
                    ownerPk: data.owner_pk,
                    ownerName: data.owner_name,
                    loginPk: data.login_pk,
                    username: data.username,
                    password: data.password,
                    isBill: data.is_bill, // Converts the returned value to a boolean
                    hasActiveBill: data.has_active_bill,
                    recon: this.recons?.filter(recon => recon.accountpk === data.account_pk),
                };

                this.accounts.push(account); // Add the processed account to the array
            }
        }

        return this.accounts.sort((a, b) => (a.accountName > b.accountName ? 1 : -1));
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

    async getVwAccount(pk: number) {
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

    createAccount(accountData: Partial<VwAccount>): Observable<VwAccount> {
        return from(
            this.supabase
                .from('tb_accounts')
                .insert([
                    {
                        account_name: accountData.accountName,
                        url: accountData.url,
                        owner_pk: accountData.ownerPk,
                        owner_name: accountData.ownerName,
                        login_pk: accountData.loginPk,
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
                    return data![0] as VwAccount; // Return the created account as VwAccount
                })
        );
    }
}
