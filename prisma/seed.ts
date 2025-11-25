import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  try {
    // demo user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.upsert({
      where: { email: "ashkan@example.com" },
      update: {
        password: hashedPassword,
        name: "Ashkan",
      },
      create: {
        email: "ashkan@example.com",
        password: hashedPassword,
        name: "Ashkan",
      },
    });

    console.log("Demo user created/updated successfully:", user.email, "- Name:", user.name);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
