"use client";

import { Influencer } from "@/lib/influencers";
import InfluencerDetailModalSkeleton from "./InfluencerDetailModalSkeleton";

interface InfluencerDetailModalProps {
  influencer: Influencer | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorited: boolean;
  onFavoriteClick: (influencerId: string) => Promise<void>;
  isLoading: boolean;
}

export default function InfluencerDetailModal({
  influencer,
  isOpen,
  onClose,
  isFavorited,
  onFavoriteClick,
  isLoading,
}: InfluencerDetailModalProps) {
  if (!isOpen) return null;

  if (isLoading) {
    return <InfluencerDetailModalSkeleton />;
  }

  if (!influencer) {
    return (
      <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 flex flex-col items-center">
          <p className="text-gray-700 text-center">Failed to load influencer details.</p>
          <button
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-blue-500 to-purple-600 text-white p-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${influencer.id}`}
              alt={influencer.name}
              className="w-16 h-16 bg-white rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold">{influencer.name}</h2>
              <p className="text-blue-100 text-sm mt-1">{influencer.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">Age</p>
              <p className="text-2xl font-bold text-blue-600">{influencer.age}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">Gender</p>
              <p className="text-2xl font-bold text-purple-600">
                {influencer.gender ? influencer.gender.charAt(0) + influencer.gender.slice(1).toLowerCase().replace('_', '-') : ''}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Engagement Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Followers</p>
                <p className="text-3xl font-bold text-gray-900">
                  {((influencer.followers ?? 0) / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Engagement Rate</p>
                <p className="text-3xl font-bold text-gray-900">{influencer.engagementRate}%</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Avg Likes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {((influencer.avgLikes ?? 0) / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Avg Comments</p>
                <p className="text-3xl font-bold text-gray-900">{influencer.avgComments}</p>
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Active Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {influencer.platform.map((platform) => (
                <span
                  key={platform}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Topics & Interests</h3>
            <div className="flex flex-wrap gap-2">
              {influencer.topics.map((topic, index) => (
                <span
                  key={`${topic}-${index}`}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => onFavoriteClick(influencer.id)}
              className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 ${
                isFavorited
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
              disabled={isLoading}
            >
              {isFavorited ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
