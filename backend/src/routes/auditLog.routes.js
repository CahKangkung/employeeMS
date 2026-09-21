const express = require('express');
const prisma = require('../prisma');
const { authenticate, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate, requireRole('admin'));

router.get('/', async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
    });
    const total = await prisma.auditLog.count();
    res.json({ data: logs, total, page: Number(page), limit: Number(limit) });
});

module.exports = router;