const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
        return res.status(401).json({ error: 'Email atau password salah' });
    }

    const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
        return res.status(401).json({ error: 'Email atau password salah' });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.json({ token, role: user.role });
});

module.exports = router;