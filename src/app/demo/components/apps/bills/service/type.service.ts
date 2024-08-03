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

    async setAllTypes() {
        await this.getType('owner', 'Owner');
        await this.getType('type_bill', 'Bill');
        await this.getType('type_bill_frequency', 'Frequency');
        await this.getType('type_bill_priority', 'Priority');
        await this.getType('type_payment', 'Payment');
    }

    async getAllTypes(): Promise<parentType[]> {
        await this.setAllTypes();
        return this.allTypesSubject.getValue();
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

    getOwnerDetails(ownerPk: number): string {
        this.setAllTypes().then(

        );
        this.allTypes$.subscribe(data => {
            const ownerType = data.find(type => type.name === 'Owner');
            if (ownerType && ownerType.children) {
                const owner = ownerType.children.find(child => child.pk === ownerPk);
                return owner ? owner.name : 'Unknown';
            }
            return 'Unknown';
        });
        return 'Unknown';
    }

    getLoginDetails(loginPk: number): string {
        this.getAllTypes().then(data => {
                const loginType = data.find(type => type.name === 'Login');
                if (loginType && loginType.children) {
                    const login = loginType.children.find(child => child.pk === loginPk);
                    return login ? login.name : 'Unknown';
                }
                return 'Unknown';
            }
        );

        return 'Unknown';
    }
}
