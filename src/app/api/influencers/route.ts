import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { filterInfluencers, paginateResults } from "@/lib/influencers";

export async function GET(request: NextRequest) {
  try {
    const { response } = await requireSession();
    if (response) return response;

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
