import api from './api';
import type { EmployeeListResponse } from '../types/employee';

export interface EmployeeFilters {
    search?: string;
    departmentId?: number;
    status?: string;
}

export async function getEmployees(filters: EmployeeFilters = {}): Promise<EmployeeListResponse> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.departmentId) params.set('departmentId', String(filters.departmentId));
    if (filters.status) params.set('status', filters.status);

    return api.get(`/employees?${params.toString()}`);
}

export async function deleteEmployee(id: number): Promise<void> {
    return api.del(`/employees/${id}`);
}