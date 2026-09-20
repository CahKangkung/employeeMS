import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../services/employee.service';
import { getDepartments } from '../services/department.service';
import type { Employee, Department } from '../types/employee';
import { getErrorMessage } from '../utils/errorMessage';

function EmployeeList() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const role = localStorage.getItem('role');

    const loadEmployees = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getEmployees({
                search: search || undefined,
                departmentId: departmentId ? Number(departmentId) : undefined,
                status: status || undefined,
            });
            setEmployees(res.data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [search, departmentId, status]);

    useEffect(() => {
        getDepartments().then(setDepartments);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(loadEmployees, 300); // debounce search
        return () => clearTimeout(timeout);
    }, [loadEmployees]);

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin hapus employee ini?')) return;
        setError('');
        try {
            await deleteEmployee(id);
            loadEmployees();
        } catch (err) {
            setError(getErrorMessage(err))
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Employee MS</h1>
                <Link to="/api-documentation" className="text-sm text-gray-600 hover:underline">API Docs</Link>
                <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
                    Logout
                </button>
            </div>

            {error && (
                <p className="bg-red-50 text-red-600 text-sm rounded px-3 py-2 mb-4">
                    {error}
                </p>
            )}

            <div className="flex flex-col md:flex-row gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Cari nama/email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded px-3 py-2 flex-1"
                />
                <div className="relative">
                    <select
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        // className="border rounded px-3 py-2"
                        className="appearance-none border rounded px-3 py-2 pr-8 w-full"
                    >
                        <option value="">Semua Departemen</option>
                        {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                    <svg
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div className="relative">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        // className="border rounded px-3 py-2"
                        className="appearance-none border rounded px-3 py-2 pr-8 w-full"
                    >
                        <option value="">Semua Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <svg
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                {role === 'admin' && (
                    <Link
                    to="/employees/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700"
                    >
                    + Tambah
                    </Link>
                )}
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                {loading ? (
                    <p className="p-6 text-center text-gray-500">Loading...</p>
                ) : employees.length === 0 ? (
                    <p className="p-6 text-center text-gray-500">Belum ada data employee</p>
                ) : (
                    <>
                        {/* Tampilan mobile */}
                        <div className="md:hidden divide-y">
                            {employees.map((emp) => (
                                <div key={emp.id} className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold">{emp.fullName}</p>
                                            <p className="text-gray-500 text-xs">{emp.email}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs shrink-0 ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                            {emp.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">{emp.department.name}</p>
                                    <div className="flex gap-3 text-sm">
                                        <Link to={`/employees/${emp.id}`} className="text-blue-600 hover:underline">Detail</Link>
                                        {role === 'admin' && (
                                            <>
                                            <Link to={`/employees/${emp.id}/edit`} className="text-yellow-600 hover:underline">Edit</Link>
                                            <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:underline">Hapus</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tampilan tablet/desktop */}
                        <table className="w-full text-sm hidden md:table">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="p-3">Nama</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Departemen</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp.id} className="border-t">
                                        <td className="p-3">{emp.fullName}</td>
                                        <td className="p-3">{emp.email}</td>
                                        <td className="p-3">{emp.department.name}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="p-3 space-x-2 whitespace-nowrap">
                                            <Link to={`/employees/${emp.id}`} className="text-blue-600 hover:underline">Detail</Link>
                                            {role === 'admin' && (
                                                <>
                                                <Link to={`/employees/${emp.id}/edit`} className="text-yellow-600 hover:underline">Edit</Link>
                                                <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:underline">Hapus</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
}

export default EmployeeList;