export interface Department {
    id: number;
    name: string;
}

export interface Employee {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    status: string;
    departmentId: number;
    department: Department;
    createdAt: string;
}

export interface EmployeeListResponse {
    data: Employee[];
    total: number;
    page: number;
    limit: number;
}

export interface EmployeeInput {
    fullName: string;
    email: string;
    phone?: string;
    departmentId: number;
    status?: string;
}