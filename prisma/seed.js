// prisma/seed.js - Plain JavaScript (no tsx needed)
const { PrismaClient } = require('@prisma/client');
const { hashSync } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = hashSync('lawo@admin2024', 10);
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: { password },
    create: {
      username: 'admin',
      password,
      email: 'hgmarketing966@gmail.com',
    },
  });
  const check = await prisma.adminUser.findUnique({ where: { username: 'admin' } });
  console.log('Admin upserted. username:', check.username, '| password length:', check.password.length);
  console.log('Login: admin / lawo@admin2024');
  console.log('Tukar password selepas login pertama!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
