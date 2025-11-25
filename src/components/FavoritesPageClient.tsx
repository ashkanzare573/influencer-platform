"use client";

import { useState } from "react";
import { Influencer } from "@/lib/influencers";
import { InfluencerCard } from "@/components/InfluencerCard";
import { InfluencerDetailModal } from "@/components/InfluencerDetailModal";
import Link from "next/link";

interface FavoritesPageClientProps {
  initialFavorites: Influencer[];
}

export function FavoritesPageClient({ initialFavorites }: FavoritesPageClientProps) {
  const [favorites, setFavorites] = useState<Influencer[]>(initialFavorites);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {favorites.length > 0 && (
          <div className="mb-6 text-sm text-gray-600">
            You have {favorites.length} favorite influencer{favorites.length !== 1 ? "s" : ""}
          </div>
        )}

        {favorites.length === 0 ? (
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
    </>
  );
}
