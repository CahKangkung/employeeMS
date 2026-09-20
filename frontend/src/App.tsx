import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeDetail from './pages/EmployeeDetail';
import ApiDocs from './pages/ApiDocs';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem('token');
    return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) return <Navigate to="/login" replace />;
    if (role !== 'admin') return <Navigate to="/employees" replace />;
    return <>{children}</>;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/api-documentation" element={<ApiDocs />} />
                <Route
                    path="/employees"
                    element={
                    <ProtectedRoute>
                        <EmployeeList />
                    </ProtectedRoute>
                    }
                />
                <Route 
                    path="/employees/new" 
                    element={
                    <AdminRoute>
                        <EmployeeForm />
                    </AdminRoute>} 
                />
                <Route 
                    path="/employees/:id/edit" 
                    element={
                    <AdminRoute>
                        <EmployeeForm />
                    </AdminRoute>} 
                />
                <Route 
                    path="/employees/:id" 
                    element={
                    <ProtectedRoute>
                        <EmployeeDetail />
                    </ProtectedRoute>} 
                />
                <Route path="*" element={<Navigate to="/employees" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

