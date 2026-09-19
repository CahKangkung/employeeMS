const express = require('express');
const prisma = require('../prisma');
const { authenticate, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

// GET /api/employees (list + search + filter + sort + pagination)
router.get('/', async (req, res) => {
    const { search, departmentId, status, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;

    const where = {};
    if (search) where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
    ];
    if (departmentId) where.departmentId = Number(departmentId);
    if (status) where.status = status;

    const employees = await prisma.employee.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { department: true },
    });
    const total = await prisma.employee.count({ where });

    res.json({ data: employees, total, page: Number(page), limit: Number(limit)})
});

// POST /api/employees (role admin)
router.post('/', requireRole('admin'), async (req, res) => {
    const { fullName, email, phone, departmentId, status } = req.body;

    if (!fullName || !email || !departmentId) {
        return res.status(400).json({ error: 'fullName, email, dan departmentId wajib diisi' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Format email tidak valid' });
    }

    try {
        const employee = await prisma.employee.create({
            data: { fullName, email, phone, departmentId: Number(departmentId), status: status || 'active' },
        });
        await logAudit(req.user.id, 'CREATE', 'Employee', employee.id, JSON.stringify(req.body));
        res.status(201).json(employee);
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Email sudah terdaftar' });
        }
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

const { logAudit } = require('../utils/auditLog');

// GET /api/employees/:id
router.get('/:id', async (req, res) => {
    const employee = await prisma.employee.findUnique({
        where: { id: Number(req.params.id) },
        include: { department: true },
    });

    if (!employee) return res.status(404).json({ error: 'Employee tidak ditemukan' });
    res.json(employee);
});

// PUT /api/employees/:id (role admin)
router.put('/:id', requireRole('admin'), async (req, res) => {
    const id = Number(req.params.id);
    const { fullName, email, phone, departmentId, status } = req.body;

    if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Format email tidak valid' });
    }
    }

    const data = {};
    if (fullName) data.fullName = fullName;
    if (email) data.email = email;
    if (phone !== undefined) data.phone = phone;
    if (departmentId) data.departmentId = Number(departmentId);
    if (status) data.status = status;

    try {
        const employee = await prisma.employee.update({ where: { id }, data });
        await logAudit(req.user.id, 'UPDATE', 'Employee', id, JSON.stringify(req.body));
        res.json(employee);
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Employee tidak ditemukan' });
        if (err.code === 'P2002') return res.status(409).json({ error: 'Email sudah terdaftar' });
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// DELETE /api/employees/:id (role admin)
router.delete('/:id', requireRole('admin'), async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma.employee.delete({ where: { id } });
        await logAudit(req.user.id, 'DELETE', 'Employee', id, null);
        res.status(204).send();
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Employee tidak ditemukan' });
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

module.exports = router;