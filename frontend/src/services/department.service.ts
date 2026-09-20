import api from './api';
import type { Department } from '../types/employee';

export async function getDepartments(): Promise<Department[]> {
    return api.get('/departments');
}