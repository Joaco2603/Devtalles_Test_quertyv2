export interface User {
    id: string,
    email: string,
    discordId: string | null;
    password: string | null;
    first_name: string;
    last_name: string | null;
    address: string;
    isActive: boolean;
    role: 'admin' | 'client' | 'user';
    two_factor_secret: string | null;
    is_two_factor_enabled: boolean;
    is_two_factor_pending: boolean;
    mustChangePassword: boolean;
};