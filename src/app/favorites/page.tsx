import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { FavoritesPageClient } from "@/components/FavoritesPageClient";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InfluencerSummary } from "@/lib/influencers";

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Get user's favorites from database with only summary data (optimized)
  const userEmail = session.user?.email;
  let favorites: InfluencerSummary[] = [];
  
  if (userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (user) {
      const favoriteRecords = await prisma.favorite.findMany({
        where: { userId: user.id },
        include: {
          influencer: {
            select: {
              id: true,
              name: true,
              location: true,
              followers: true,
              engagementRate: true,
              platforms: {
                select: {
                  platform: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              topics: {
                select: {
                  topic: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      
      // Transform to InfluencerSummary format
      favorites = favoriteRecords.map((fav) => ({
        id: fav.influencer.id,
        name: fav.influencer.name,
        location: fav.influencer.location,
        followers: fav.influencer.followers,
        engagementRate: fav.influencer.engagementRate,
        platform: fav.influencer.platforms.map((p) => p.platform.name),
        topics: fav.influencer.topics.map((t) => t.topic.name),
      }));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        className="bg-linear-to-r from-red-300 to-pink-600 text-white shadow-lg"
        title={<h1 className="text-3xl max-sm:text-2xl font-bold">❤️ My Favorites</h1>}
        subtitle={<p className="text-red-100 text-sm mt-1">Your saved influencer profiles</p>}
        rightContent={
          <Link
            href="/"
            className="px-4 py-2 flex items-center justify-center max-sm:text-sm bg-white text-pink-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            ← Back to Discover
          </Link>
        }
      />
      <FavoritesPageClient initialFavorites={favorites} />
    </div>
  );
}
