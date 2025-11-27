export default function InfluencerDetailModalSkeleton() {
  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-linear-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-start gap-4 animate-pulse">
            <div className="w-16 h-16 bg-white/20 rounded-full" />
            <div className="flex-1">
              <div className="h-6 bg-white/20 rounded w-1/3 mb-2" />
              <div className="h-4 bg-white/20 rounded w-1/4" />
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6 animate-pulse">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg h-20" />
            <div className="bg-purple-50 p-4 rounded-lg h-20" />
          </div>

          <div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 p-4 rounded-lg h-24" />
              <div className="border border-gray-200 p-4 rounded-lg h-24" />
              <div className="border border-gray-200 p-4 rounded-lg h-24" />
              <div className="border border-gray-200 p-4 rounded-lg h-24" />
            </div>
          </div>

          <div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="flex flex-wrap gap-2">
              <div className="h-7 bg-blue-100 rounded-full w-20" />
              <div className="h-7 bg-blue-100 rounded-full w-24" />
              <div className="h-7 bg-blue-100 rounded-full w-16" />
            </div>
          </div>

          <div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="flex flex-wrap gap-2">
              <div className="h-7 bg-purple-100 rounded-full w-16" />
              <div className="h-7 bg-purple-100 rounded-full w-20" />
              <div className="h-7 bg-purple-100 rounded-full w-24" />
              <div className="h-7 bg-purple-100 rounded-full w-20" />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
            <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
