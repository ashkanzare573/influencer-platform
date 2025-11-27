import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
