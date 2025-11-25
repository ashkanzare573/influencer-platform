import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  try {
    // Check if demo user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "ashkan@example.com" },
    });

    if (existingUser) {
      console.log("Demo user already exists");
      return;
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        email: "ashkan@example.com",
        password: hashedPassword,
        name: "Demo User",
      },
    });

    console.log("Demo user created successfully:", user.email);
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
