export interface User {
    id: string | number;
    status?: string;
    created_by?: string | number;
    created_at?: string;
    modified_by?: string | number;
    modified_at?: string;
    email: string;
    password_hash?: string;
    full_name: string;
    avatar?: string;
    phone?: string;
}