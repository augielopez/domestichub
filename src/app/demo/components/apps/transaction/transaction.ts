export interface CombinedTransaction {
    id: string;
    account_id: string;
    date: string; // ISO date string (e.g., "2025-04-05")
    amount: number;
    description?: string;
    source_file_name?: string;
    tags?: string[];
    created_at?: string; // ISO timestamp string
    updated_at?: string; // ISO timestamp string
}

