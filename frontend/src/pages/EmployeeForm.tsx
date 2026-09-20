import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmployeeById, createEmployee, updateEmployee } from '../services/employee.service';
import { getDepartments } from '../services/department.service';
import type { Department } from '../types/employee';
import { getErrorMessage } from '../utils/errorMessage';

function EmployeeForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [departments, setDepartments] = useState<Department[]>([]);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [status, setStatus] = useState('active');
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getDepartments().then(setDepartments);
    }, []);

    useEffect(() => {
        if (!isEdit) return;
        async function fetchEmployee() {
            try {
                const emp = await getEmployeeById(Number(id));
                setFullName(emp.fullName);
                setEmail(emp.email);
                setPhone(emp.phone || '');
                setDepartmentId(String(emp.departmentId));
                setStatus(emp.status);
            } catch (err) {
                setError(getErrorMessage(err));          
            } finally {
                setLoading(false);
            }
        }
        fetchEmployee();
    }, [id, isEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const payload = { fullName, email, phone: phone || undefined, departmentId: Number(departmentId), status };
            if (isEdit) {
                await updateEmployee(Number(id), payload);
            } else {
                await createEmployee(payload);
            }
            navigate('/employees');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Terjadi kesalahan, coba lagi');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="p-6 text-center text-gray-500">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-6">
                <h1 className="text-xl font-bold mb-4">{isEdit ? 'Edit Employee' : 'Tambah Employee'}</h1>
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm mb-1">Nama Lengkap</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded px-3 py-2" required />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Telepon</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Departemen</label>
                        <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="w-full border rounded px-3 py-2" required>
                            <option value="">Pilih departemen</option>
                            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded px-3 py-2">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                            {saving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button type="button" onClick={() => navigate('/employees')} className="border px-4 py-2 rounded hover:bg-gray-50">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EmployeeForm;