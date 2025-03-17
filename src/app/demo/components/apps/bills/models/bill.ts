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

export interface VwRecon {
    account_name: string; // Account name
    sql: string; // SQL statement
    transaction_desc: string; // Transaction description
    transaction_date: Date; // Transaction date
    due_date: string; // Due date (cast to text)
    transaction_amount: number; // Transaction amount
    expected_amount: number; // Expected amount (payment * -1)
    source: string; // Source
    isfixed: boolean; // Is the transaction fixed
    accountpk: number; // Account primary key
    ownerpk: number; // Owner primary key
    loginpk: number; // Login primary key
    billpk: number; // Bill primary key
    priorityfk: number | null; // Priority foreign key
    frequencyfk: number | null; // Frequency foreign key
    typefk: number | null; // Type foreign key
    paymenttypefk: number | null; // Payment type foreign key
    isincludedinmonthlypayment: boolean; // Is included in monthly payment
    isactive: boolean; // Is active
}
