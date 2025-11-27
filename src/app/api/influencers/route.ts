import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { filterInfluencers, paginateResults } from "@/lib/influencers";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const topic = searchParams.get("topic") || undefined;
    const platform = searchParams.get("platform") || undefined;
    const gender = searchParams.get("gender") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 12;

    const filtered = await filterInfluencers({
      search,
      topic: topic || undefined,
      platform: platform || undefined,
      gender: gender || undefined,
    });

    const result = paginateResults(filtered, page, pageSize);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching influencers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
