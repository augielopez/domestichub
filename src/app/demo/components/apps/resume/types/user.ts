export interface User {
    id?: string;
    first_name?: string;
    last_name?: string;
    username: string;
    password: string;
    email: string;
    date_of_birth?: string;
    address_street1?: string;
    address_street2?: string;
    address_city?: string;
    address_state?: string;
    address_zip?: string;
    is_active?: boolean;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
}

