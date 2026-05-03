import { connectDB } from "@/lib/db";
import { RateLimit } from "@/lib/db/models";

/**
 * Check rate limit for a form submission
 * Uses a basic token bucket / sliding window approach
 *
 * Note: For this to work efficiently in production with MongoDB,
 * you should create a TTL index on the `windowStart` field:
 * db.RateLimit.createIndex({ "windowStart": 1 }, { expireAfterSeconds: 60 })
 */
export async function checkRateLimit(
  formId: string,
  ip: string,
  limitPerMinute: number,
): Promise<{ allowed: boolean; remaining: number }> {
  await connectDB();
  const now = new Date();
  // Round down to the current minute
  const windowStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
  );

  const identifier = `${formId}:${ip}`;

  try {
    const rateLimit = await RateLimit.findOneAndUpdate(
      { identifier, windowStart },
      {
        $inc: { count: 1 },
      },
      { new: true, upsert: true },
    ).lean();

    const allowed = (rateLimit?.count ?? 0) <= limitPerMinute;
    const remaining = Math.max(0, limitPerMinute - (rateLimit?.count ?? 0));

    return { allowed, remaining };
  } catch (error) {
    // Fallback: allow request if rate limiter fails
    console.error("Rate limit check failed:", error);
    return { allowed: true, remaining: 1 };
  }
}
