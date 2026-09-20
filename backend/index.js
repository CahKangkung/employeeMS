require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
app.set('trust proxy', 1);

const allowedUrl = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
].filter(Boolean);

app.use(cors({
    origin: allowedUrl,
}));

app.use(express.json());

// Limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Terlalu banyak request, coba lagi nanti' }
});
app.use('/api', limiter);

// Routes
const authRoutes = require('./src/routes/auth.routes');
app.use('/api/auth', authRoutes);

const employeeRoutes = require('./src/routes/employee.routes');
app.use('/api/employees', employeeRoutes);

const departmentRoutes = require('./src/routes/department.routes');
app.use('/api/departments', departmentRoutes);

// Health
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error
const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

