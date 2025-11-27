"use client";

export function InfluencerCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-linear-to-br from-blue-200 to-purple-200 flex items-center justify-center">
        <div className="w-20 h-20 bg-gray-200 rounded-full" />
      </div>
      <div className="p-4">
        <div className="h-5 bg-gray-00 rounded w-2/3 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/3 mb-4" />
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="bg-blue-50 p-2 rounded">
            <div className="h-3 bg-blue-200 rounded w-1/2 mb-1" />
            <div className="h-4 bg-blue-100 rounded w-2/3" />
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <div className="h-3 bg-purple-200 rounded w-1/2 mb-1" />
            <div className="h-4 bg-purple-100 rounded w-2/3" />
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          <div className="h-4 bg-gray-100 rounded w-12" />
          <div className="h-4 bg-gray-100 rounded w-10" />
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-gray-200 rounded" />
          <div className="flex-1 h-8 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}
