const bcrypt = require('bcryptjs');
const prisma = require('../src/prisma');

async function main() {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const viewerPassword = await bcrypt.hash('viewer123', 10);

    await prisma.user.upsert({
        where: { email: 'admin@employeems.com' },
        update: {},
        create: { email: 'admin@employeems.com', password: adminPassword, role: 'admin' },
    });

    await prisma.user.upsert({
        where: { email: 'viewer@employeems.com' },
        update: {},
        create: { email: 'viewer@employeems.com', password: viewerPassword, role: 'viewer' },
    });

    console.log('Seed complete: admin & viewer user dibuat');
}

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });