const test = require('node:test');
const assert = require('node:assert');

const BASE_URL = 'http://localhost:5000';

test('GET /health returns status ok', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.status, 'ok');
});

test('POST /api/auth/login dengan kredensial benar mengembalikan token', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@employeems.com', password: 'admin123' }),
    });
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(body.token);
    assert.strictEqual(body.role, 'admin');
});

test('POST /api/auth/login dengan password salah mengembalikan 401', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@employeems.com', password: 'salah' }),
    });
    assert.strictEqual(res.status, 401);
});