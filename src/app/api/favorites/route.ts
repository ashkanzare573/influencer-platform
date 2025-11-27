import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getInfluencerById } from "@/lib/influencers";

export async function GET(request: NextRequest) {
  try {
    const { session, response } = await requireSession();
    if (response) return response;

    const user = await prisma.user.findUnique({
      where: { email: session!.user!.email! },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const favoritePromises = favorites.map((fav) => getInfluencerById(fav.influencerId));
    const favoriteInfluencers = (await Promise.all(favoritePromises)).filter(
      (inf): inf is Exclude<typeof inf, null> => inf !== null
    );

    return NextResponse.json(favoriteInfluencers);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session, response } = await requireSession();
    if (response) return response;

    const user = await prisma.user.findUnique({
      where: { email: session!.user!.email! },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { influencerId } = await request.json();

    if (!influencerId) {
      return NextResponse.json(
        { error: "Missing influencerId" },
        { status: 400 }
      );
    }

    const influencer = await getInfluencerById(influencerId);
    if (!influencer) {
      return NextResponse.json(
        { error: "Influencer not found" },
        { status: 404 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        influencerId,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Already favorited" },
        { status: 409 }
      );
    }

    console.error("Error creating favorite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
