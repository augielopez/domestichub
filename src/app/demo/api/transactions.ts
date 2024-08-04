export interface TransactionDetails {
    account_name: string;
    sql: string;
    transaction_desc: string;
    transaction_date: Date;
    due_date: string;
    transaction_amount: number;
    expected_amount: number;
    source: string;
    isfixed: boolean;
    accountpk: number;
    ownerpk: number;
    loginpk: number;
    billpk: number;
    priorityfk: number;
    frequencyfk: number;
    typefk: number;
    paymenttypefk: number;
    loading?: boolean;
    isediting: boolean;
}
