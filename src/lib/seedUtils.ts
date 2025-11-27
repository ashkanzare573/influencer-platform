import { PrismaClient, Gender } from "@prisma/client";

export function extractUniquePlatforms(influencers: { platform: string[] }[]): string[] {
  const set = new Set<string>();
  influencers.forEach((inf) => inf.platform?.forEach((p) => set.add(p)));
  return Array.from(set);
}

export function extractUniqueTopics(influencers: { topics: string[] }[]): string[] {
  const set = new Set<string>();
  influencers.forEach((inf) => inf.topics?.forEach((t) => set.add(t)));
  return Array.from(set);
}

export function convertGenderToEnum(gender: string | null | undefined): Gender | null {
  if (!gender) return null;
  
  const normalized = gender.toLowerCase();
  
  if (normalized === "male") return Gender.MALE;
  if (normalized === "female") return Gender.FEMALE;
  if (normalized === "non-binary") return Gender.NON_BINARY;
  
  return null;
}

export async function upsertPlatform(prisma: PrismaClient, name: string) {
  return prisma.platform.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

export async function upsertTopic(prisma: PrismaClient, name: string) {
  return prisma.topic.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

export async function upsertInfluencerWithRelations(
  prisma: PrismaClient,
  influencerData: any,
  platformMap: Map<string, string>,
  topicMap: Map<string, string>
) {
  // Convert gender to enum
  const genderEnum = convertGenderToEnum(influencerData.gender);
  
  // Upsert influencer
  const influencer = await prisma.influencer.upsert({
    where: { id: influencerData.id },
    update: {
      name: influencerData.name,
      email: influencerData.email || null,
      location: influencerData.location || null,
      age: influencerData.age || null,
      gender: genderEnum,
      followers: influencerData.followers || null,
      engagementRate: influencerData.engagementRate || null,
      avgLikes: influencerData.avgLikes || null,
      avgComments: influencerData.avgComments || null,
    },
    create: {
      id: influencerData.id,
      name: influencerData.name,
      email: influencerData.email || null,
      location: influencerData.location || null,
      age: influencerData.age || null,
      gender: genderEnum,
      followers: influencerData.followers || null,
      engagementRate: influencerData.engagementRate || null,
      avgLikes: influencerData.avgLikes || null,
      avgComments: influencerData.avgComments || null,
    },
  });

  // Connect platforms
  if (influencerData.platform) {
    for (const platformName of influencerData.platform) {
      const platformId = platformMap.get(platformName);
      if (platformId) {
        await prisma.influencerPlatform.upsert({
          where: {
            influencerId_platformId: {
              influencerId: influencer.id,
              platformId: platformId,
            },
          },
          update: {},
          create: {
            influencerId: influencer.id,
            platformId: platformId,
          },
        });
      }
    }
  }

  // Connect topics
  if (influencerData.topics) {
    for (const topicName of influencerData.topics) {
      const topicId = topicMap.get(topicName);
      if (topicId) {
        await prisma.influencerTopic.upsert({
          where: {
            influencerId_topicId: {
              influencerId: influencer.id,
              topicId: topicId,
            },
          },
          update: {},
          create: {
            influencerId: influencer.id,
            topicId: topicId,
          },
        });
      }
    }
  }

  return influencer;
}
