"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Influencer } from "@/lib/influencers";
import { InfluencerCard } from "@/components/InfluencerCard";
import { InfluencerDetailModal } from "@/components/InfluencerDetailModal";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { Pagination } from "@/components/Pagination";

interface FilterResult {
  data: Influencer[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter options
  const [topics, setTopics] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch filter options and favorites on mount
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      loadFilterOptions();
      loadFavorites();
    }
  }, [status, router]);

  const loadFilterOptions = async () => {
    try {
      const response = await fetch("/api/filter-options");
      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics);
        setPlatforms(data.platforms);
        setGenders(data.genders);
      }
    } catch (error) {
      console.error("Error loading filter options:", error);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await fetch("/api/favorites");
      if (response.ok) {
        const data = await response.json();
        const favoriteIds = new Set<string>(data.map((inf: Influencer) => inf.id));
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  // Fetch influencers with filters
  const loadInfluencers = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
        ...(selectedTopic && { topic: selectedTopic }),
        ...(selectedPlatform && { platform: selectedPlatform }),
        ...(selectedGender && { gender: selectedGender }),
      });

      const response = await fetch(`/api/influencers?${params}`);
      if (response.ok) {
        const result: FilterResult = await response.json();
        setInfluencers(result.data);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error("Error loading influencers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedTopic, selectedPlatform, selectedGender]);

  // Load influencers when filters change
  useEffect(() => {
    setCurrentPage(1);
    loadInfluencers(1);
  }, [search, selectedTopic, selectedPlatform, selectedGender, loadInfluencers]);

  // Load influencers when page changes
  useEffect(() => {
    if (currentPage > 1) {
      loadInfluencers(currentPage);
    }
  }, [currentPage, loadInfluencers]);

  const handleFavoriteClick = async (influencerId: string) => {
    try {
      if (favorites.has(influencerId)) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${influencerId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          const newFavorites = new Set(favorites);
          newFavorites.delete(influencerId);
          setFavorites(newFavorites);
          if (selectedInfluencer?.id === influencerId) {
            setSelectedInfluencer(null);
            setIsDetailModalOpen(false);
          }
        }
      } else {
        // Add to favorites
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ influencerId }),
        });
        if (response.ok) {
          const newFavorites = new Set(favorites);
          newFavorites.add(influencerId);
          setFavorites(newFavorites);
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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Influencer Platform</h1>
            <p className="text-blue-100 text-sm mt-1">
              Discover and manage your favorite influencers
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/favorites"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              ❤️ Favorites ({favorites.size})
            </Link>
            <div className="text-sm">
              <p>Welcome, {session?.user?.name || session?.user?.email}!</p>
            </div>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
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

        {/* Results Info */}
        {!isLoading && influencers.length > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {influencers.length} influencers (Page {currentPage} of {totalPages})
          </div>
        )}

        {/* Influencers Grid */}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </main>

      {/* Detail Modal */}
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
    </div>
  );
}
