"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { DiscoverPageClient } from "@/components/DiscoverPageClient";
import { Influencer } from "@/lib/influencers";

interface HomePageWrapperProps {
  initialInfluencers: Influencer[];
  initialFavorites: Set<string>;
  topics: string[];
  platforms: string[];
  genders: string[];
  totalPages: number;
  currentPage: number;
  search: string;
  selectedTopic: string;
  selectedPlatform: string;
  selectedGender: string;
  userNameOrEmail?: string | null;
}

export function HomePageWrapper({
  initialInfluencers,
  initialFavorites,
  topics,
  platforms,
  genders,
  totalPages,
  currentPage,
  search,
  selectedTopic,
  selectedPlatform,
  selectedGender,
  userNameOrEmail,
}: HomePageWrapperProps) {
  const [favoritesCount, setFavoritesCount] = useState(initialFavorites.size);

  return (
    <>
      <Header
        favoritesCount={favoritesCount}
        userNameOrEmail={userNameOrEmail}
      />
      <DiscoverPageClient
        initialInfluencers={initialInfluencers}
        initialFavorites={initialFavorites}
        topics={topics}
        platforms={platforms}
        genders={genders}
        totalPages={totalPages}
        currentPage={currentPage}
        search={search}
        selectedTopic={selectedTopic}
        selectedPlatform={selectedPlatform}
        selectedGender={selectedGender}
        onFavoritesCountChange={setFavoritesCount}
      />
    </>
  );
}
