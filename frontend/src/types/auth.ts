export interface LoginResponse {
    token: string;
    role: 'admin' | 'viewer';
}