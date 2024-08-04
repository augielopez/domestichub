import { Injectable } from '@angular/core'
import {AuthSession, createClient, SupabaseClient} from '@supabase/supabase-js'
import {environment} from '../../../../../../environments/environment'
import {Bill, childType, uiVwBill} from "../models/bill";
import {BehaviorSubject} from "rxjs";
import {DbTypesService} from "../../../../../db/db.types.service";

@Injectable({
    providedIn: 'root'
})
export class BillsService {
    private supabase: SupabaseClient
    _session: AuthSession | null = null
    uiVwBills: uiVwBill[] = [];
    uiVwBill: uiVwBill = {
        accountpk: 0,
        billspk: 0,
        owner: '',
        ownerImagePath: '',
        accountname: '',
        transactiondescription: '',
        balance: 0,
        chargetype: '',
        payment: 0,
        duedate: '',
        billtype: '',
        paymenttype: '',
        isincludedinmonthlypayment: false
    };

    private billTypesSubject = new BehaviorSubject<childType[]>([]);
    billTypes$ = this.billTypesSubject.asObservable();

    private chargeTypesSubject = new BehaviorSubject<childType[]>([]);
    chargeTypes$ = this.chargeTypesSubject.asObservable();

    private paymentTypesSubject = new BehaviorSubject<childType[]>([]);
    paymentTypes$ = this.paymentTypesSubject.asObservable();

    private ownersSubject = new BehaviorSubject<childType[]>([]);
    owners$ = this.ownersSubject.asObservable();

    returnType: childType[] = [];

    constructor(private dbTypesService: DbTypesService) {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

    get session() {
        this.supabase.auth.getSession().then(({data}) => {
            this._session = data.session
        })
        return this._session
    }

    async getBills() {
        this.uiVwBills = [];

        let {data: bills, error} = await this.supabase
            .from('vw_bills')
            .select('*');

        bills?.forEach((data) => {
            const uiBill: uiVwBill = {
                accountpk: data.accountpk,
                billspk: data.billspk,
                owner: data.owner,
                ownerImagePath: '',
                accountname: data.accountname,
                transactiondescription: data.transactiondescription,
                balance: data.balance,
                chargetype: data.chargetype,
                payment: data.payment,
                duedate: data.duedate,
                billtype: data.billtype,
                paymenttype: data.paymenttype,
                isincludedinmonthlypayment: data.isincludedinmonthlypayment
            }
            //Buffer.from(account.password, 'base64').toString('utf8')

            this.uiVwBills.push(uiBill);
        });

        return this.uiVwBills.sort((a, b) => (a.accountname > b.accountname) ? 1 : -1);
    }

    async createBill(value: any) {
        const {data, error} = await this.supabase
            .from('bill')
            .insert(
                {
                    Insert: undefined,
                    owner: value.owner,
                    accountname: value.accountname,
                    transactiondescription: value.transactiondescription,
                    balance: value.balance,
                    chargetype: value.chargetype,
                    payment: value.payment,
                    duedate: value.duedate,
                    billtype: value.billtype,
                    paymenttype: value.paymenttype,
                    isincludedinmonthlypayment: value.isincludedinmonthlypayment,
                    updatedby: 'UI',
                    updatedon: new Date(),
                    createdby: 'UI',
                    createdon: new Date()
                }
            )
            .select()
            .single();

        if (error) {
            console.log('Error inserting data:', error.message);
        } else {
            console.log('Data inserted successfully:', data);
        }
    }

    async getBill(id: any) {
        let {data: bill, error} = await this.supabase
            .from('bills')
            .select('*')
            .eq('pk', id);

        if (error) {
            console.log('Error getting data:', error.message);
        } else {
            console.log('Data read successfully:', bill);
        }

        const dbbill: Bill = bill![0];

        return dbbill;
    }

    async getBillDto(id: any) {
        let {data: bill, error} = await this.supabase
            .from('vw_bills')
            .select('*')
            .eq('pk', id);

        if (error) {
            console.log('Error getting data:', error.message);
        } else {
            console.log('Data read successfully:', bill);
        }

        const uibill: uiVwBill = bill![0];

        return uibill;
    }

    async updateBill(value: Bill) {
        const { data, error } = await this.supabase
            .from('bill')
            .update({
                Update: undefined,
                transactiondescription: value.transactiondescription,
                balance: value.balance,
                chargetypefk: value.paymenttypefk,
                payment: value.payment,
                duedate: value.duedate,
                billstypefk: value.typefk,
                paymenttypefk: value.paymenttypefk,
                frequencyfk: value.frequencyfk,
                priorityfk: value.priorityfk,
                isactive: value.isactive,
                creditlimit: value.creditlimit,
                lastpaid: value.lastpaid,
                acceptedpaymentmethodfks: value.acceptedpaymentmethodfks,
                isfixed: value.isfixed,
                typefk: value.typefk,
                sql: value.sql,
                isincludedinmonthlypayment: value.isincludedinmonthlypayment,
                notes: value.notes,
                updatedby: 'UI',
                updatedon: new Date()
            })
            .eq('pk', value.pk);

        if (error) {
            console.log('Error updating data:', error.message);
        } else {
            console.log('Data updated successfully:', data);
        }
    }


    async updateIncludeInMonthlyPayment(value: boolean, selectedPk: number) {
        const {data, error} = await this.supabase
            .from('bill')
            .update({
                Update: undefined,
                isIncludedInMonthlyPayment: value,
                updatedby: 'UI',
                updatedon: new Date()
            })
            .eq('pk', selectedPk);

        if (error) {
            console.log('Error updating data:', error.message);
        } else {
            console.log('Data updated successfully:', data);
        }
    }

    async deleteBill(selectedPk: number) {
        const {data, error} = await this.supabase
            .from('bill')
            .delete()
            .eq('pk', selectedPk);

        if (error) {
            console.log('Error deleting data:', error.message);
        } else {
            console.log('Data deleted successfully:', data);
        }
    }
}
