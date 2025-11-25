"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Influencer } from "@/lib/influencers";
import { InfluencerCard } from "@/components/InfluencerCard";
import { InfluencerDetailModal } from "@/components/InfluencerDetailModal";

export default function FavoritesPage() {
  const { status } = useSession();
  const router = useRouter();

  const [favorites, setFavorites] = useState<Influencer[]>([]);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      loadFavorites();
    }
  }, [status, router]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/favorites");
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (influencerId: string) => {
    try {
      const response = await fetch(`/api/favorites/${influencerId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setFavorites(favorites.filter((fav) => fav.id !== influencerId));
        if (selectedInfluencer?.id === influencerId) {
          setSelectedInfluencer(null);
          setIsDetailModalOpen(false);
        }
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
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
      <header className="bg-linear-to-r from-red-500 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">❤️ My Favorites</h1>
            <p className="text-red-100 text-sm mt-1">
              Your saved influencer profiles
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-white text-pink-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            ← Back to Discover
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Info */}
        {favorites.length > 0 && (
          <div className="mb-6 text-sm text-gray-600">
            You have {favorites.length} favorite influencer{favorites.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* Favorites Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 text-4xl">⏳</div>
              <p className="text-gray-600">Loading your favorites...</p>
            </div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="mb-4 text-5xl">💔</div>
            <p className="text-gray-600 text-lg mb-6">
              You haven't added any favorites yet.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Discover Influencers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((influencer) => (
              <InfluencerCard
                key={influencer.id}
                influencer={influencer}
                isFavorited={true}
                onFavoriteClick={handleRemoveFavorite}
                onViewDetails={handleViewDetails}
                isLoading={isLoading}
              />
            ))}
          </div>
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
        isFavorited={selectedInfluencer ? favorites.some((fav) => fav.id === selectedInfluencer.id) : false}
        onFavoriteClick={handleRemoveFavorite}
        isLoading={isLoading}
      />
    </div>
  );
}
