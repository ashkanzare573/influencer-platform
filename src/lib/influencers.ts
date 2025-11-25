import influencersData from "@/data/influencers.json";

export type Influencer = (typeof influencersData)[0];

export const getAllInfluencers = (): Influencer[] => {
  return influencersData;
};

export const getInfluencerById = (id: string): Influencer | undefined => {
  return influencersData.find((influencer) => influencer.id === id);
};

export const getUniqueTopics = (): string[] => {
  const topics = new Set<string>();
  influencersData.forEach((influencer) => {
    influencer.topics.forEach((topic) => topics.add(topic));
  });
  return Array.from(topics).sort();
};

export const getUniquePlatforms = (): string[] => {
  const platforms = new Set<string>();
  influencersData.forEach((influencer) => {
    influencer.platform.forEach((plat) => platforms.add(plat));
  });
  return Array.from(platforms).sort();
};

export const getUniqueGenders = (): string[] => {
  const genders = new Set<string>();
  influencersData.forEach((influencer) => {
    genders.add(influencer.gender);
  });
  return Array.from(genders).sort();
};

export interface FilterOptions {
  search?: string;
  topic?: string;
  platform?: string;
  gender?: string;
  page?: number;
  limit?: number;
}

export const filterInfluencers = (options: FilterOptions): Influencer[] => {
  let filtered = [...influencersData];

  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filtered = filtered.filter(
      (influencer) =>
        influencer.name.toLowerCase().includes(searchLower) ||
        influencer.location.toLowerCase().includes(searchLower)
    );
  }

  if (options.topic) {
    filtered = filtered.filter((influencer) =>
      influencer.topics.includes(options.topic!)
    );
  }

  if (options.platform) {
    filtered = filtered.filter((influencer) =>
      influencer.platform.includes(options.platform!)
    );
  }

  if (options.gender) {
    filtered = filtered.filter((influencer) => influencer.gender === options.gender);
  }

  return filtered;
};

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const paginateResults = <T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10
): PaginatedResult<T> => {
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
};
