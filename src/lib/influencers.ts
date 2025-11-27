import { prisma } from "./prisma";
import { Gender } from "@prisma/client";

// Summary data for cards (list view)
export interface InfluencerSummary {
  id: string;
  name: string;
  location?: string | null;
  followers?: number | null;
  engagementRate?: number | null;
  platform: string[];
  topics: string[];
}

// Full data for detail view
export interface Influencer extends InfluencerSummary {
  email?: string | null;
  age?: number | null;
  gender?: string | null;
  avgLikes?: number | null;
  avgComments?: number | null;
}

export interface FilterOptions {
  search?: string;
  topic?: string;
  platform?: string;
  gender?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Get all influencers from database with their relations

export async function getAllInfluencers(): Promise<Influencer[]> {
  const influencers = await prisma.influencer.findMany({
    include: {
      platforms: {
        include: {
          platform: true,
        },
      },
      topics: {
        include: {
          topic: true,
        },
      },
    },
  });

  return influencers.map((inf) => ({
    id: inf.id,
    name: inf.name,
    email: inf.email,
    location: inf.location,
    age: inf.age,
    gender: inf.gender,
    followers: inf.followers,
    engagementRate: inf.engagementRate,
    avgLikes: inf.avgLikes,
    avgComments: inf.avgComments,
    platform: inf.platforms.map((p) => p.platform.name),
    topics: inf.topics.map((t) => t.topic.name),
  }));
}

// Get influencer by ID
export async function getInfluencerById(
  id: string
): Promise<Influencer | null> {
  const influencer = await prisma.influencer.findUnique({
    where: { id },
    include: {
      platforms: {
        include: {
          platform: true,
        },
      },
      topics: {
        include: {
          topic: true,
        },
      },
    },
  });

  if (!influencer) return null;

  return {
    id: influencer.id,
    name: influencer.name,
    email: influencer.email,
    location: influencer.location,
    age: influencer.age,
    gender: influencer.gender,
    followers: influencer.followers,
    engagementRate: influencer.engagementRate,
    avgLikes: influencer.avgLikes,
    avgComments: influencer.avgComments,
    platform: influencer.platforms.map((p) => p.platform.name),
    topics: influencer.topics.map((t) => t.topic.name),
  };
}

/**
 * Filter influencers
 */
export async function filterInfluencers(
  options: FilterOptions
): Promise<Influencer[]> {
  const { search, topic, platform, gender } = options;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  if (gender) {
    where.gender = gender;
  }

  if (topic) {
    where.topics = {
      some: {
        topic: {
          name: topic,
        },
      },
    };
  }

  if (platform) {
    where.platforms = {
      some: {
        platform: {
          name: platform,
        },
      },
    };
  }

  const influencers = await prisma.influencer.findMany({
    where,
    include: {
      platforms: {
        include: {
          platform: true,
        },
      },
      topics: {
        include: {
          topic: true,
        },
      },
    },
  });

  return influencers.map((inf) => ({
    id: inf.id,
    name: inf.name,
    email: inf.email,
    location: inf.location,
    age: inf.age,
    gender: inf.gender,
    followers: inf.followers,
    engagementRate: inf.engagementRate,
    avgLikes: inf.avgLikes,
    avgComments: inf.avgComments,
    platform: inf.platforms.map((p) => p.platform.name),
    topics: inf.topics.map((t) => t.topic.name),
  }));
}

export function paginateResults<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 12
): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = items.slice(start, end);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

// Get unique topics from database
export async function getUniqueTopics(): Promise<string[]> {
  const topics = await prisma.topic.findMany({
    orderBy: { name: "asc" },
  });
  return topics.map((t) => t.name);
}

// Get unique platforms from database
export async function getUniquePlatforms(): Promise<string[]> {
  const platforms = await prisma.platform.findMany({
    orderBy: { name: "asc" },
  });
  return platforms.map((p) => p.name);
}

// Get unique genders from database
export async function getUniqueGenders(): Promise<string[]> {
  const genders = await prisma.influencer.findMany({
    where: { gender: { not: null } },
    select: { gender: true },
    distinct: ["gender"],
    orderBy: { gender: "asc" },
  });
  return genders
    .map((g) => g.gender as Gender)
    .filter((g): g is Gender => g !== null)
    .map((g) => g as string);
}
