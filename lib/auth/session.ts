import { auth } from "@/lib/auth";
import { cache } from "react";

/**
 * Server-side session helper using NextAuth's auth() function.
 * Cached with React's cache() to deduplicate requests within a single render.
 */
export const getSession = cache(async () => {
  return await auth();
});

/**
 * Convenience function to get the current user from the session.
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}
