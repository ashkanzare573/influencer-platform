"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Influencer, InfluencerSummary } from "@/lib/influencers";
import { InfluencerCard } from "@/components/InfluencerCard";
import InfluencerDetailModal from "@/components/InfluencerDetailModal";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { Pagination } from "@/components/Pagination";
import { FilterBadge } from "@/components/FilterBadge";
import { InfluencerCardSkeleton } from "@/components/InfluencerCardSkeleton";

interface DiscoverPageClientProps {
  initialInfluencers: InfluencerSummary[];
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

  const [influencers, setInfluencers] = useState<InfluencerSummary[]>(initialInfluencers);
  const [favorites, setFavorites] = useState<Set<string>>(initialFavorites);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeout = useRef<NodeJS.Timeout | null>(null);

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [selectedPlatform, setSelectedPlatform] = useState(initialPlatform);
  const [selectedGender, setSelectedGender] = useState(initialGender);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pages, setPages] = useState(totalPages);
  const isInitialMount = useRef(true);

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
    }, 1000);

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
    // Skip fetch on initial mount - use SSR data
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const loadInfluencers = async () => {
      // Scroll to top on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setIsLoading(true);
      if (loadingTimeout.current) clearTimeout(loadingTimeout.current);
      
      const startTime = Date.now();
      
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
          
          // Calculate remaining time to show skeleton (minimum 800ms)
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, 800 - elapsedTime);
          
          loadingTimeout.current = setTimeout(() => {
            setInfluencers(result.data);
            setPages(result.totalPages);
            setIsLoading(false);
          }, remainingTime);
        }
      } catch (error) {
        console.error("Error loading influencers:", error);
        setIsLoading(false);
      }
    };

    loadInfluencers();
    // Cleanup timeout on unmount
    return () => {
      if (loadingTimeout.current) clearTimeout(loadingTimeout.current);
    };
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

  const handleViewDetails = async (influencer: InfluencerSummary) => {
    setIsDetailLoading(true);
    setIsDetailModalOpen(true);
    try {
      const response = await fetch(`/api/influencers/${influencer.id}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedInfluencer(data);
      } else {
        console.error('Failed to fetch influencer details:', response.status, response.statusText);
        setSelectedInfluencer(null);
      }
    } catch (error) {
      console.error('Error fetching influencer details:', error);
      setSelectedInfluencer(null);
    } finally {
      setIsDetailLoading(false);
    }
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

        <div className="mb-4 flex flex-col md:flex-row justify-between items-center min-h-8">
          <div className="text-sm text-gray-600">
            {!isLoading && influencers.length > 0 && (
              <>Showing {influencers.length} influencers (Page {currentPage} of {pages})</>
            )}
          </div>

          {/* Active Filters */}
          {(debouncedSearch || selectedTopic || selectedPlatform || selectedGender) && (
            <div className="flex flex-wrap items-center gap-2 max-md:mt-1">
              {debouncedSearch && (
                <FilterBadge
                  label="Search"
                  value={debouncedSearch}
                  onRemove={() => setSearch("")}
                  color="blue"
                />
              )}
              
              {selectedTopic && (
                <FilterBadge
                  label="Topic"
                  value={selectedTopic}
                  onRemove={() => setSelectedTopic("")}
                  color="purple"
                />
              )}
              
              {selectedPlatform && (
                <FilterBadge
                  label="Platform"
                  value={selectedPlatform}
                  onRemove={() => setSelectedPlatform("")}
                  color="green"
                />
              )}
              
              {selectedGender && (
                <FilterBadge
                  label="Gender"
                  value={selectedGender.charAt(0) + selectedGender.slice(1).toLowerCase().replace('_', '-')}
                  onRemove={() => setSelectedGender("")}
                  color="pink"
                />
              )}
              
              {/* Clear All Button - show when more than 1 filter is active */}
              {[debouncedSearch, selectedTopic, selectedPlatform, selectedGender].filter(Boolean).length > 1 && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 cursor-pointer bg-red-100 text-red-http://localhost:3000/ text-sm font-medium px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
                >
                  Clear All 
                </button>
              )}
            </div>
          )}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <InfluencerCardSkeleton key={i} />
            ))}
          </div>
        )}
        {!isLoading && influencers.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <p className="text-gray-600 text-lg">No influencers found matching your criteria.</p>
          </div>
        )}
        {!isLoading && influencers.length > 0 && (
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
        isLoading={isDetailLoading}
      />
    </>
  );
}
