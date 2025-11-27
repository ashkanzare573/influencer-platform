import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { getInfluencerById } from "@/lib/influencers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, response } = await requireSession();
    if (response) return response;
    
    const { id } = await params;
    const influencer = await getInfluencerById(id);
    if (!influencer) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(influencer);
  } catch (error) {
    console.error("Error fetching influencer detail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
