interface ReconPreview {
    billpk: number;
    bill_name: string;
    sql: string;
    transaction_desc?: string;
    transaction_date?: string;
    transaction_id?: string;
    transaction_amount?: number;
    expected_amount: number;
    due_date: string; // or just the due day in month
    source: string;
    status: 'paid' | 'unpaid' | 'partial' | 'overpaid';
}
