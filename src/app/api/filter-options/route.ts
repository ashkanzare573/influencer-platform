import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUniqueTopics, getUniquePlatforms, getUniqueGenders } from "@/lib/influencers";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const topics = getUniqueTopics();
    const platforms = getUniquePlatforms();
    const genders = getUniqueGenders();

    return NextResponse.json({ topics, platforms, genders });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
