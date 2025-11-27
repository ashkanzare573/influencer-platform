import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";
import { prisma } from "./prisma";


// Get the current session or return an unauthorized response
export async function requireSession() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return {
      session: null,
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }
  
  return { session, response: null };
}


// Get the current session (without throwing error)
export async function getSession() {
  return await getServerSession(authOptions);
}


// Get the current authenticated user from the database
export async function requireUser() {
  const { session, response } = await requireSession();
  if (response) return { user: null, response };

  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
  });

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      ),
    };
  }

  return { user, response: null };
}
