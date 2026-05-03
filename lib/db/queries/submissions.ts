import { connectDB } from "@/lib/db";
import { Submission, type ISubmission } from "@/lib/db/models/submission";

interface GetSubmissionsOptions {
  page?: number;
  limit?: number;
  spam?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

interface PaginatedSubmissions {
  submissions: ISubmission[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Get paginated submissions for a form with optional filters.
 */
export async function getSubmissionsByForm(
  formId: string,
  options: GetSubmissionsOptions = {},
): Promise<PaginatedSubmissions> {
  await connectDB();

  const { page = 1, limit = 20, spam, dateFrom, dateTo } = options;
  const skip = (page - 1) * limit;

  // Build filter
  const filter: Record<string, unknown> = { formId };

  if (spam !== undefined) {
    filter.spam = spam;
  }

  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) {
      (filter.createdAt as Record<string, unknown>).$gte = dateFrom;
    }
    if (dateTo) {
      (filter.createdAt as Record<string, unknown>).$lte = dateTo;
    }
  }

  const [submissions, total] = await Promise.all([
    Submission.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<ISubmission[]>(),
    Submission.countDocuments(filter),
  ]);

  return {
    submissions,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get a single submission by ID.
 */
export async function getSubmissionById(id: string) {
  await connectDB();
  return Submission.findById(id).lean<ISubmission | null>();
}

/**
 * Create a new submission.
 */
export async function createSubmission(data: {
  formId: string;
  data: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  spam?: boolean;
}) {
  await connectDB();
  return Submission.create(data);
}

/**
 * Count submissions for a form (optionally filtered).
 */
export async function countSubmissions(
  formId: string,
  filter?: { spam?: boolean; since?: Date },
) {
  await connectDB();

  const query: Record<string, unknown> = { formId };

  if (filter?.spam !== undefined) {
    query.spam = filter.spam;
  }

  if (filter?.since) {
    query.createdAt = { $gte: filter.since };
  }

  return Submission.countDocuments(query);
}
