export interface ReconTransaction {
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
    isincludedinmonthlypayment: boolean;
    isactive: boolean;
    loading?: boolean;
    isediting: boolean;
}

export interface UsBankTransactions {
    date: Date;             // Date of the transaction (as a string in MM/DD/YY format)
    transaction: string;    // Type of transaction (e.g., DEBIT, CREDIT)
    name: string;           // Name or description of the transaction
    memo: string;           // Additional information or memo related to the transaction
    amount: number;         // The amount of the transaction (can be negative for debits)
}

export interface FidelityTransaction {
    run_date: Date | null;
    action: string;
    symbol: string;
    description: string;
    type: string;
    quantity: number;
    price: number | null;
    commission: number | null;
    fees: number | null;
    accrued_interest: number | null;
    amount: number;
    cash_balance: number;
    settlement_date: Date | null;
}

export interface FirstTechTransactions {
    transaction_id: string;         // Assuming Transaction ID is a complex string due to commas
    posting_date: Date | null;      // Date represented as a Date, e.g., "8/30/24"
    effective_date: Date | null;    // Date represented as a Date, e.g., "8/30/24"
    transaction_type: string;       // "Debit" or "Credit"
    amount: number;                // Numeric value for the transaction amount
    check_number: string;          // Optional, as some entries have missing values
    reference_number: string;      // String representation of the reference number
    description: string;           // Description of the transaction
    transaction_category: string;  // Optional as some entries have missing values
    type: string;                  // Type of transaction (e.g., "Debit Card", "Deposit")
    balance: number;               // Numeric value for the balance after the transaction
    memo: string;                  // Optional field for memos
    extended_description: string;  // Detailed description of the transaction
}

export interface HistoryFirstTechTransactions {
    transaction_id: string;         // Assuming Transaction ID is a complex string due to commas
    posting_date: Date | null;      // Date represented as a Date, e.g., "8/30/24"
    effective_date: Date | null;    // Date represented as a Date, e.g., "8/30/24"
    transaction_type: string;       // "Debit" or "Credit"
    amount: number;                // Numeric value for the transaction amount
    check_number: string;          // Optional, as some entries have missing values
    reference_number: string;      // String representation of the reference number
    description: string;           // Description of the transaction
    transaction_category: string;  // Optional as some entries have missing values
    type: string;                  // Type of transaction (e.g., "Debit Card", "Deposit")
    balance: number;               // Numeric value for the balance after the transaction
    memo: string;                  // Optional field for memos
    extended_description: string;  // Detailed description of the transaction
    source: string                 // Details what first tech account these transactions are coming from
}
