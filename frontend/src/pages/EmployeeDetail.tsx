import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEmployeeById } from '../services/employee.service';
import type { Employee } from '../types/employee';

function EmployeeDetail() {
    const { id } = useParams();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getEmployeeById(Number(id)).then(setEmployee).finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="p-6 text-center text-gray-500">Loading...</p>;
    if (!employee) return <p className="p-6 text-center text-gray-500">Employee tidak ditemukan</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-6">
                <h1 className="text-xl font-bold mb-4">Detail Employee</h1>
                <dl className="space-y-2 text-sm">
                    <div><dt className="text-gray-500">Nama</dt><dd className="font-medium">{employee.fullName}</dd></div>
                    <div><dt className="text-gray-500">Email</dt><dd className="font-medium">{employee.email}</dd></div>
                    <div><dt className="text-gray-500">Telepon</dt><dd className="font-medium">{employee.phone || '-'}</dd></div>
                    <div><dt className="text-gray-500">Departemen</dt><dd className="font-medium">{employee.department.name}</dd></div>
                    <div><dt className="text-gray-500">Status</dt><dd className="font-medium">{employee.status}</dd></div>
                </dl>
                <Link to="/employees" className="inline-block mt-4 text-blue-600 hover:underline">← Kembali</Link>
            </div>
        </div>
    );
}

export default EmployeeDetail;