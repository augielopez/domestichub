import { Injectable } from '@angular/core'
import {AuthSession, createClient, SupabaseClient} from '@supabase/supabase-js'
import {environment} from '../../../../../../environments/environment'
import {childType, parentType, uiVwBill} from "../models/bill";
import {BehaviorSubject} from "rxjs";
import {DbTypesService} from "../../../../../db/db.types.service";

@Injectable({
    providedIn: 'root'
})
export class TypeService {
    private supabase: SupabaseClient
    _session: AuthSession | null = null

    private billTypesSubject = new BehaviorSubject<childType[]>([]);
    billTypes$ = this.billTypesSubject.asObservable();

    private chargeTypesSubject = new BehaviorSubject<childType[]>([]);
    chargeTypes$ = this.chargeTypesSubject.asObservable();

    private paymentTypesSubject = new BehaviorSubject<childType[]>([]);
    paymentTypes$ = this.paymentTypesSubject.asObservable();

    private ownersSubject = new BehaviorSubject<childType[]>([]);
    owners$ = this.ownersSubject.asObservable();

    private allTypesSubject = new BehaviorSubject<parentType[]>([]);
    allTypes$ = this.allTypesSubject.asObservable();

    types: parentType[] = [
        {name: 'Owner', children: []},
        {name: 'Bill', children: []},
        {name: 'Frequency', children: []},
        {name: 'Priority', children: []},
        {name: 'Payment', children: []},
    ];

    errorMessage: string = '';
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

    async getAllTypes() {
        await this.getType('owner', 'Owner');
        await this.getType('type_bill', 'Bill');
        await this.getType('type_bill_frequency', 'Frequency');
        await this.getType('type_bill_priority', 'Priority');
        await this.getType('type_payment', 'Payment');
    }

    async getType(tableName: string, typeName: string) {
        this.returnType = [];

        let {data: returnItem, error} = await this.supabase
            .from(tableName)
            .select('*');

        returnItem?.forEach((data) => {
            const newChild: childType = {
                pk: data.pk,
                name: data.name
            }
            //Buffer.from(account.password, 'base64').toString('utf8')

            this.returnType.push(newChild);
        });

        this.returnType.sort((a, b) => (a.name > b.name) ? 1 : -1);
        this.settype(typeName, this.returnType)
    }

    settype(typeName: string, children: childType[]): void {
        const type = this.types.find(t => t.name === typeName);
        if (type) {
            type.children = children;
        } else {
            this.errorMessage = `Type ${typeName} not found`;
        }

        this.allTypesSubject.next(this.types);
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

    async updateBill(value: any) {
        const {data, error} = await this.supabase
            .from('bill')
            .update({
                Update: undefined,
                transactiondescription: value.transactiondescription,
                balance: value.balance,
                chargetypefk: value.chargetype,
                payment: value.payment,
                duedate: value.duedate,
                billstypefk: value.billtype,
                paymenttypefk: value.paymenttype,
                isIncludedInMonthlyPayment: value.isIncludedInMonthlyPayment,
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
