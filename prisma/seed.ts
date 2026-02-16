import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {

  // ✅ Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "Dinevora Demo",
      slug: "dinevora-demo",
      timezone: "Asia/Kolkata",
      locale: "en-IN",
    },
  });

  // ✅ Restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Dinevora Flagship",
      slug: "flagship",
      city: "Mumbai",
      country: "India",
      tenantId: tenant.id,
    },
  });

  // ✅ Categories (NOW we pass tenantId)
  await prisma.menuCategory.createMany({
    data: [
      {
        name: "Starters",
        position: 1,
        tenantId: tenant.id,
        restaurantId: restaurant.id,
      },
      {
        name: "Main Course",
        position: 2,
        tenantId: tenant.id,
        restaurantId: restaurant.id,
      },
    ],
  });
// ✅ OWNER USER (VERY IMPORTANT)

const hashedPassword = await bcrypt.hash("owner123", 10);

await prisma.user.create({
  data: {
    email: "owner@dinevora.com",
    name: "Demo Owner",
    password: hashedPassword,
    role: "OWNER",
    tenantId: tenant.id,
  },
});

console.log("✅ Owner user created");

  console.log("✅ Database seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
