import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("lawo@admin2024", 12);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password,
      email: "hgmarketing966@gmail.com",
    },
  });
  console.log("✓ Admin user: admin / lawo@admin2024");
  console.log("  Tukar password selepas login pertama!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
