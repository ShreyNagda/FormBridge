import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Form, Submission } from "@/lib/db/models";
import { FileText, Inbox, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { formatDistanceToNow } from "@/lib/utils";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export default async function DashboardHome() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  await connectDB();

  const userForms = await Form.find({ userId })
    .select({ _id: 1, name: 1 })
    .lean();
  const formIds = userForms.map((form) => form._id);
  const formMap = new Map(userForms.map((form) => [String(form._id), form]));

  const [formsCount, recentSubmissions] = await Promise.all([
    Form.countDocuments({ userId }),
    Submission.find({
      formId: { $in: formIds },
      spam: false,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  const submissionsToday = await Submission.countDocuments({
    formId: { $in: formIds },
    createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
  });

  const formattedSubmissions = recentSubmissions.map((submission) => {
    const form = formMap.get(submission.formId.toString());
    return {
      id: submission._id,
      createdAt: submission.createdAt,
      spam: submission.spam,
      form: form
        ? { id: form._id, name: form.name }
        : { id: "", name: "Unknown" },
    };
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your forms and recent activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Forms
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-[28px] font-semibold tabular-nums text-foreground">
              {formsCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Submissions Today
            </CardTitle>
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-[28px] font-semibold tabular-nums text-foreground">
              {submissionsToday}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Delivery Rate
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-[28px] font-semibold tabular-nums text-foreground">
              —
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[15px] font-semibold">
            Recent Submissions
          </CardTitle>
          {formattedSubmissions.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/forms">
                View all
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {formattedSubmissions.length === 0 ? (
            <div className="px-6 py-12">
              <EmptyState
                icon={Inbox}
                title="No submissions yet"
                description="Embed your form endpoint to start receiving data."
                action={
                  formsCount > 0 ? (
                    <Button size="sm" asChild>
                      <Link href="/dashboard/forms">View forms</Link>
                    </Button>
                  ) : (
                    <Button size="sm" asChild>
                      <Link href="/dashboard/forms/new">
                        Create your first form
                      </Link>
                    </Button>
                  )
                }
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-45">Timestamp</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead className="w-20">Status</TableHead>
                  <TableHead className="w-25 text-right">ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formattedSubmissions.map((submission) => (
                  <TableRow key={submission.id.toString()}>
                    <TableCell className="text-xs tabular-nums text-muted-foreground">
                      {formatDistanceToNow(submission.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {submission.form.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={submission.spam ? "destructive" : "secondary"}
                        className="font-mono text-[11px]"
                      >
                        {submission.spam ? "spam" : "ok"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                      <Link
                        href={`/dashboard/forms/${submission.form.id}?tab=submissions`}
                        className="hover:text-foreground"
                      >
                        {submission.id.toString().slice(-6)}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
