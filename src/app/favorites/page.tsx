import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { FavoritesPageClient } from "@/components/FavoritesPageClient";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAllInfluencers, Influencer } from "@/lib/influencers";

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Get user's favorites
  const userEmail = session.user?.email;
  let favorites: Influencer[] = [];
  
  if (userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (user) {
      const favoriteRecords = await prisma.favorite.findMany({
        where: { userId: user.id },
        select: { influencerId: true },
      });
      const influencerIds = favoriteRecords.map((fav) => fav.influencerId);
      
      // Get influencer data from JSON
      const allInfluencers = getAllInfluencers();
      favorites = allInfluencers.filter((inf) => influencerIds.includes(inf.id));
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
            className="px-4 py-2 max-sm:text-sm bg-white text-pink-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            ← Back to Discover
          </Link>
        }
      />
      <FavoritesPageClient initialFavorites={favorites} />
    </div>
  );
}
