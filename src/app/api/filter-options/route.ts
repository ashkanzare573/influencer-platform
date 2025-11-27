import { NextRequest, NextResponse } from "next/server";
import { getUniqueTopics, getUniquePlatforms, getUniqueGenders } from "@/lib/influencers";

export async function GET(request: NextRequest) {
  try {
    const topics = await getUniqueTopics();
    const platforms = await getUniquePlatforms();
    const genders = await getUniqueGenders();

    return NextResponse.json({ topics, platforms, genders });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
