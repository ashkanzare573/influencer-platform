import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const { id } = await params;

    const favorite = await prisma.favorite.delete({
      where: {
        userId_influencerId: {
          userId: user.id,
          influencerId: id,
        },
      },
    });

    return NextResponse.json(favorite);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    console.error("Error deleting favorite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
