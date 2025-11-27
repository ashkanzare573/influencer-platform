import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";

/**
 * Get the current session or return an unauthorized response
 */
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

/**
 * Get the current session (without throwing error)
 */
export async function getSession() {
  return await getServerSession(authOptions);
}
