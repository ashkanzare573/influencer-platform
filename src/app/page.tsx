import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { HomePageWrapper } from "@/components/HomePageWrapper";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  filterInfluencers,
  paginateResults,
  getUniqueTopics,
  getUniquePlatforms,
  getUniqueGenders,
} from "@/lib/influencers";

interface SearchParams {
  search?: string;
  topic?: string;
  platform?: string;
  gender?: string;
  page?: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Await searchParams
  const params = await searchParams;

  // Parse search params
  const search = params.search || "";
  const selectedTopic = params.topic || "";
  const selectedPlatform = params.platform || "";
  const selectedGender = params.gender || "";
  const currentPage = parseInt(params.page || "1", 10);

  // Get filter options
  const topics = getUniqueTopics();
  const platforms = getUniquePlatforms();
  const genders = getUniqueGenders();

  // Filter and paginate influencers
  const filtered = filterInfluencers({
    search,
    topic: selectedTopic || undefined,
    platform: selectedPlatform || undefined,
    gender: selectedGender || undefined,
  });
  const { data: influencers, totalPages } = paginateResults(filtered, currentPage, 12);

  // Get user's favorites
  const userEmail = session.user?.email;
  let favoriteIds = new Set<string>();
  if (userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (user) {
      const favoriteRecords = await prisma.favorite.findMany({
        where: { userId: user.id },
        select: { influencerId: true },
      });
      favoriteIds = new Set(favoriteRecords.map((fav) => fav.influencerId));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HomePageWrapper
        initialInfluencers={influencers}
        initialFavorites={favoriteIds}
        topics={topics}
        platforms={platforms}
        genders={genders}
        totalPages={totalPages}
        currentPage={currentPage}
        search={search}
        selectedTopic={selectedTopic}
        selectedPlatform={selectedPlatform}
        selectedGender={selectedGender}
        userNameOrEmail={session.user?.name || session.user?.email}
      />
    </div>
  );
}
