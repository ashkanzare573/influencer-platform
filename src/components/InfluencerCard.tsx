"use client";

import { useState, useCallback } from "react";
import { Influencer } from "@/lib/influencers";

interface InfluencerCardProps {
  influencer: Influencer;
  isFavorited: boolean;
  onFavoriteClick: (influencerId: string) => Promise<void>;
  onViewDetails: (influencer: Influencer) => void;
  isLoading: boolean;
}

export function InfluencerCard({
  influencer,
  isFavorited,
  onFavoriteClick,
  onViewDetails,
  isLoading,
}: InfluencerCardProps) {
  const [isFavoritingLoading, setIsFavoritingLoading] = useState(false);

  const handleFavoriteClick = useCallback(async () => {
    setIsFavoritingLoading(true);
    try {
      await onFavoriteClick(influencer.id);
    } finally {
      setIsFavoritingLoading(false);
    }
  }, [influencer.id, onFavoriteClick]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Header with avatar placeholder */}
      <div className="h-48 bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-purple-600">
          {influencer.name.charAt(0)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
          {influencer.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3">{influencer.location}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-gray-600">Followers</p>
            <p className="font-semibold text-blue-600">
              {(influencer.followers / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <p className="text-gray-600">Engagement</p>
            <p className="font-semibold text-purple-600">{influencer.engagementRate}%</p>
          </div>
        </div>

        {/* Topics */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {influencer.topics.slice(0, 2).map((topic) => (
              <span
                key={topic}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {topic}
              </span>
            ))}
            {influencer.topics.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                +{influencer.topics.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(influencer)}
            className="flex-1 bg-blue-500 text-white text-sm font-medium py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={isLoading || isFavoritingLoading}
          >
            View Details
          </button>
          <button
            onClick={handleFavoriteClick}
            className={`flex-1 text-sm font-medium py-2 rounded transition-colors disabled:opacity-50 ${
              isFavorited
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            disabled={isLoading || isFavoritingLoading}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavoritingLoading ? "..." : isFavorited ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </div>
  );
}
