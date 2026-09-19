const prisma = require("../prisma")

async function logAudit(userId, action, tableName, recordId, detail) {
    await prisma.auditLog.create({
        data: { userId, action, tableName, recordId, detail},
    });
}

module.exports = { logAudit };
