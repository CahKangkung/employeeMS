import api from './api';
import type { LoginResponse } from '../types/auth';

export async function login(email: string, password: string): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>('/auth/login', { email, password });
    return res;
}