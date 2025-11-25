"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Influencer } from "@/lib/influencers";
import { InfluencerCard } from "@/components/InfluencerCard";
import { InfluencerDetailModal } from "@/components/InfluencerDetailModal";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { Pagination } from "@/components/Pagination";

interface DiscoverPageClientProps {
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
  onFavoritesCountChange?: (count: number) => void;
}

export function DiscoverPageClient({
  initialInfluencers,
  initialFavorites,
  topics,
  platforms,
  genders,
  totalPages,
  currentPage: initialPage,
  search: initialSearch,
  selectedTopic: initialTopic,
  selectedPlatform: initialPlatform,
  selectedGender: initialGender,
  onFavoritesCountChange,
}: DiscoverPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [influencers, setInfluencers] = useState<Influencer[]>(initialInfluencers);
  const [favorites, setFavorites] = useState<Set<string>>(initialFavorites);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [selectedPlatform, setSelectedPlatform] = useState(initialPlatform);
  const [selectedGender, setSelectedGender] = useState(initialGender);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pages, setPages] = useState(totalPages);

  // Sync state with URL params when navigating
  useEffect(() => {
    const params = searchParams;
    const urlSearch = params.get("search") || "";
    const urlTopic = params.get("topic") || "";
    const urlPlatform = params.get("platform") || "";
    const urlGender = params.get("gender") || "";
    const urlPage = parseInt(params.get("page") || "1", 10);

    setSearch(urlSearch);
    setDebouncedSearch(urlSearch);
    setSelectedTopic(urlTopic);
    setSelectedPlatform(urlPlatform);
    setSelectedGender(urlGender);
    setCurrentPage(urlPage);
  }, [searchParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1200);

    return () => clearTimeout(timer);
  }, [search]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedTopic) params.set("topic", selectedTopic);
    if (selectedPlatform) params.set("platform", selectedPlatform);
    if (selectedGender) params.set("gender", selectedGender);
    if (currentPage > 1) params.set("page", currentPage.toString());

    router.push(`/?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, selectedTopic, selectedPlatform, selectedGender, currentPage, router]);

  // Fetch influencers when filters change
  useEffect(() => {
    const loadInfluencers = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(selectedTopic && { topic: selectedTopic }),
          ...(selectedPlatform && { platform: selectedPlatform }),
          ...(selectedGender && { gender: selectedGender }),
        });

        const response = await fetch(`/api/influencers?${params.toString()}`);
        if (response.ok) {
          const result = await response.json();
          setInfluencers(result.data);
          setPages(result.totalPages);
        }
      } catch (error) {
        console.error("Error loading influencers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInfluencers();
  }, [currentPage, debouncedSearch, selectedTopic, selectedPlatform, selectedGender]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedTopic, selectedPlatform, selectedGender]);

  const handleFavoriteClick = async (influencerId: string) => {
    try {
      if (favorites.has(influencerId)) {
        const response = await fetch(`/api/favorites/${influencerId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          const newFavorites = new Set(favorites);
          newFavorites.delete(influencerId);
          setFavorites(newFavorites);
          onFavoritesCountChange?.(newFavorites.size);
          if (selectedInfluencer?.id === influencerId) {
            setSelectedInfluencer(null);
            setIsDetailModalOpen(false);
          }
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ influencerId }),
        });
        if (response.ok) {
          const newFavorites = new Set(favorites);
          newFavorites.add(influencerId);
          setFavorites(newFavorites);
          onFavoritesCountChange?.(newFavorites.size);
        }
      }
    } catch (error) {
      console.error("Error managing favorite:", error);
    }
  };

  const handleViewDetails = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setIsDetailModalOpen(true);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedTopic("");
    setSelectedPlatform("");
    setSelectedGender("");
    setCurrentPage(1);
    router.push("/");
  };

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <SearchAndFilter
          search={search}
          onSearchChange={setSearch}
          selectedTopic={selectedTopic}
          onTopicChange={setSelectedTopic}
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
          selectedGender={selectedGender}
          onGenderChange={setSelectedGender}
          topics={topics}
          platforms={platforms}
          genders={genders}
          isLoading={isLoading}
        />

        <div className="mb-4 text-sm text-gray-600 min-h-5">
          {!isLoading && influencers.length > 0 && (
            <>Showing {influencers.length} influencers (Page {currentPage} of {pages})</>
          )}
        </div>

        {isLoading && influencers.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 text-4xl">⏳</div>
              <p className="text-gray-600">Loading influencers...</p>
            </div>
          </div>
        ) : influencers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <p className="text-gray-600 text-lg">No influencers found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {influencers.map((influencer) => (
                <InfluencerCard
                  key={influencer.id}
                  influencer={influencer}
                  isFavorited={favorites.has(influencer.id)}
                  onFavoriteClick={handleFavoriteClick}
                  onViewDetails={handleViewDetails}
                  isLoading={isLoading}
                />
              ))}
            </div>

            {pages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={pages}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </main>

      <InfluencerDetailModal
        influencer={selectedInfluencer}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedInfluencer(null);
        }}
        isFavorited={selectedInfluencer ? favorites.has(selectedInfluencer.id) : false}
        onFavoriteClick={handleFavoriteClick}
        isLoading={isLoading}
      />
    </>
  );
}
