const express = require('express');
const prisma = require('../prisma');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const { logAudit } = require('../utils/auditLog');

const router = express.Router();

router.use(authenticate);

// GET /api/departments
router.get('/', async (req, res) => {
    const departments = await prisma.department.findMany({
        orderBy: { name: 'asc' },
    });
    res.json(departments);
});

// POST /api/departments (role admin)
router.post('/', requireRole('admin'), async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'name wajib diisi' });
    }
    const department = await prisma.department.create({ data: { name } });
    await logAudit(req.user.id, 'CREATE', 'Department', department.id, JSON.stringify(req.body));
    res.status(201).json(department);
});

module.exports = router;