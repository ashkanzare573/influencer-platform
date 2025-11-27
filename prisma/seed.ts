
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as fs from "fs";
import * as path from "path";
import {
  extractUniquePlatforms,
  extractUniqueTopics,
  upsertPlatform,
  upsertTopic,
  upsertInfluencerWithRelations,
} from "../src/lib/seedUtils";

const prisma = new PrismaClient();

async function main() {
  try {
    //  Create demo user
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

    //  Read influencers JSON file
    const jsonPath = path.join(process.cwd(), "src", "data", "influencers.json");
    const influencersData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    //  Extract unique platforms and topics
    const platforms = extractUniquePlatforms(influencersData);
    const topics = extractUniqueTopics(influencersData);

    // 4. Create platforms
    const platformMap = new Map<string, string>();
    for (const platformName of platforms) {
      const platform = await upsertPlatform(prisma, platformName);
      platformMap.set(platformName, platform.id);
    }

    //  Create topics
    const topicMap = new Map<string, string>();
    for (const topicName of topics) {
      const topic = await upsertTopic(prisma, topicName);
      topicMap.set(topicName, topic.id);
      console.log(`  ✓ ${topicName}`);
    }

    //  Create influencers with relations
    for (const influencerData of influencersData) {
      await upsertInfluencerWithRelations(prisma, influencerData, platformMap, topicMap);
      console.log(`  ✓ ${influencerData.name}`);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
