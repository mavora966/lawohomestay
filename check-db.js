// Diagnostic script — test DB connection + admin lookup. DELETE after use.
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

(async () => {
  console.log("=== DB DIAGNOSTIC ===");
  console.log("DATABASE_URL set:", !!process.env.DATABASE_URL);
  try {
    const count = await prisma.adminUser.count();
    console.log("admin_users count:", count);

    const users = await prisma.adminUser.findMany({
      select: { id: true, username: true, password: true },
    });
    for (const u of users) {
      console.log("---");
      console.log("id:", u.id);
      console.log("username:", JSON.stringify(u.username));
      console.log("password length:", u.password.length);
      console.log("password prefix:", u.password.slice(0, 7));
      const match = await bcrypt.compare("lawo@admin2024", u.password);
      console.log("compare 'lawo@admin2024':", match);
    }
    console.log("=== DB OK ===");
  } catch (e) {
    console.error("!!! DB ERROR:", e.message);
  } finally {
    await prisma.$disconnect();
  }
})();
