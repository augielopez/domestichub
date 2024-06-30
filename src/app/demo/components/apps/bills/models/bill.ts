import {Entity} from "../../../models/entity";

export interface Bill extends Entity {
    accountfk: number;
    priorityfk: number;
    isactive: boolean;
    transactiondescription: string;
    frequencyfk: number;
    duedate: string;
    creditlimit: number;
    balance: number;
    payment: number;
    lastpaid: Date;
    acceptedpaymentmethodfks: string;
    isfixed: boolean;
    typefk: number;
    paymenttypefk: number;
    sql: string;
    isincludedinmonthlypayment: boolean;
    notes: string;

}

export interface uiVwBill{
    accountpk: number,
    billspk: number,
    owner: string,
    ownerImagePath: string,
    accountname: string,
    transactiondescription: string,
    balance: number,
    chargetype: string,
    payment: number
    duedate: string,
    billtype: string,
    paymenttype: string,
    isincludedinmonthlypayment: boolean
}

export interface allTypes {
    owner: parentType,
    billType: parentType,
    paymentType: parentType,
    chargeType: parentType
}

export interface parentType {
    name: string;
    children: childType[];
}

export interface childType {
    pk: number;
    name: string;
}
