import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db";
import { Form, Submission, Webhook } from "@/lib/db/models";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Activity } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export default async function FormsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  await connectDB();
  const forms = await Form.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const formIds = forms.map((form) => form._id);

  const submissionCounts = await Submission.aggregate([
    { $match: { formId: { $in: formIds } } },
    { $group: { _id: "$formId", count: { $sum: 1 } } },
  ]);

  const webhookCounts = await Webhook.aggregate([
    { $match: { formId: { $in: formIds } } },
    { $group: { _id: "$formId", count: { $sum: 1 } } },
  ]);

  const submissionsMap = new Map(
    submissionCounts.map((item) => [item._id as string, item.count as number]),
  );
  const webhooksMap = new Map(
    webhookCounts.map((item) => [item._id as string, item.count as number]),
  );

  const list = forms.map((form) => ({
    id: String(form._id),
    name: form.name,
    createdAt: form.createdAt,
    submissionsCount: submissionsMap.get(String(form._id)) ?? 0,
    webhooksCount: webhooksMap.get(String(form._id)) ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
          <p className="text-muted-foreground">
            Manage your forms and submission endpoints.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/forms/new">
            <Plus className="mr-2 h-4 w-4" />
            New Form
          </Link>
        </Button>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No forms found"
          description="You don't have any forms yet. Create one to start receiving submissions."
          action={
            <Button asChild>
              <Link href="/dashboard/forms/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Form
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Webhooks</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/forms/${form.id}`}
                      className="hover:underline"
                    >
                      {form.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{form.submissionsCount}</Badge>
                  </TableCell>
                  <TableCell>{form.webhooksCount}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(form.createdAt, { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Link href={`/dashboard/forms/${form.id}?tab=settings`}>
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Settings</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
