import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

/**
 * Session check endpoint used by middleware/proxy to verify authentication.
 * Returns the current session or null.
 */
export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json(session);
  } catch {
    return NextResponse.json({ user: null });
  }
}
