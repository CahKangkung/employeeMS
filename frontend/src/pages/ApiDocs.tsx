import { useState } from 'react';

interface EndpointDef {
    name: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    auth: boolean;
    bodyExample?: string;
}

const API_ORIGIN = (import.meta.env.VITE_API_URL as string).replace('/api', '');

const ENDPOINTS: EndpointDef[] = [
    { name: 'Health Check', method: 'GET', path: '/health', auth: false },
    { name: 'Login', method: 'POST', path: '/api/auth/login', auth: false, bodyExample: '{\n  "email": "admin@employeems.com",\n  "password": "admin123"\n}' },
    { name: 'List Employees', method: 'GET', path: '/api/employees?search=&departmentId=&status=&page=1&limit=10', auth: true },
    { name: 'Get Employee by ID', method: 'GET', path: '/api/employees/1', auth: true },
    { name: 'Create Employee', method: 'POST', path: '/api/employees', auth: true, bodyExample: '{\n  "fullName": "",\n  "email": "",\n  "departmentId": 1\n}' },
    { name: 'Update Employee', method: 'PUT', path: '/api/employees/1', auth: true, bodyExample: '{\n  "status": "inactive"\n}' },
    { name: 'Delete Employee', method: 'DELETE', path: '/api/employees/1', auth: true },
    { name: 'Export Employees CSV', method: 'GET', path: '/api/employees/export/csv', auth: true },
    { name: 'List Departments', method: 'GET', path: '/api/departments', auth: true },
    { name: 'Create Department', method: 'POST', path: '/api/departments', auth: true, bodyExample: '{\n  "name": ""\n}' },
];

function ApiDocs() {
    const [selected, setSelected] = useState(0);
    const [path, setPath] = useState(ENDPOINTS[0].path);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [body, setBody] = useState(ENDPOINTS[0].bodyExample || '');
    const [status, setStatus] = useState<number | null>(null);
    const [response, setResponse] = useState('');
    const [sending, setSending] = useState(false);

    const endpoint = ENDPOINTS[selected];

    const handleSelect = (i: number) => {
        setSelected(i);
        setPath(ENDPOINTS[i].path);
        setBody(ENDPOINTS[i].bodyExample || '');
        setStatus(null);
        setResponse('');
    };

    const handleSend = async () => {
        setSending(true);
        setStatus(null);
        setResponse('');
        try {
            const options: RequestInit = {
                method: endpoint.method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(endpoint.auth && token ? { Authorization: `Bearer ${token}` } : {}),
                },
            };
            if (endpoint.method !== 'GET' && endpoint.method !== 'DELETE' && body) {
                options.body = body;
            }
            const res = await fetch(`${API_ORIGIN}${path}`, options);
            setStatus(res.status);
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                setResponse(JSON.stringify(await res.json(), null, 2));
            } else {
                setResponse(await res.text());
            }
        } catch (err) {
            setResponse(err instanceof Error ? err.message : 'Request gagal');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-1">API Documentation</h1>
                <p className="text-sm text-gray-500 mb-6">Employee MS test seluruh endpoint</p>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 bg-white rounded-lg shadow p-3">
                        <p className="text-xs font-semibold text-gray-500 mb-2">ENDPOINTS</p>
                        <ul className="space-y-1">
                            {ENDPOINTS.map((ep, i) => (
                                <li key={ep.name}>
                                    <button
                                    onClick={() => handleSelect(i)}
                                    className={`w-full text-left px-2 py-1.5 rounded text-sm flex gap-2 items-center ${selected === i ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                                    >
                                        <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                                            ep.method === 'GET' ? 'bg-green-100 text-green-700' :
                                            ep.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                                            ep.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>{ep.method}</span>
                                        {ep.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2 bg-white rounded-lg shadow p-4 space-y-3">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">URL (bisa diedit, misal ganti angka id)</label>
                            <div className="flex gap-2">
                                <span className="px-2 py-2 bg-gray-100 rounded text-xs font-mono">{endpoint.method}</span>
                                <input value={path} onChange={(e) => setPath(e.target.value)} className="flex-1 border rounded px-3 py-2 text-sm font-mono" />
                            </div>
                        </div>

                        {endpoint.auth && (
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Authorization Token (Bearer)</label>
                                <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste JWT token" className="w-full border rounded px-3 py-2 text-sm font-mono" />
                            </div>
                        )}

                        {endpoint.method !== 'GET' && endpoint.method !== 'DELETE' && (
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Request Body (JSON)</label>
                                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} className="w-full border rounded px-3 py-2 text-sm font-mono" />
                            </div>
                        )}

                        <button onClick={handleSend} disabled={sending} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50">
                            {sending ? 'Mengirim...' : 'Send Request'}
                        </button>

                        {status !== null && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">
                                    Status: <span className={status < 300 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{status}</span>
                                </p>
                                <pre className="bg-gray-900 text-gray-100 text-xs p-3 rounded overflow-x-auto max-h-64">{response}</pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApiDocs;