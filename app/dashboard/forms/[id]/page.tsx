import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db";
import { Form, Submission, Webhook, User } from "@/lib/db/models";
import { redirect } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Mail,
  ShieldAlert,
  Zap,
  Plus,
  Webhook as WebhookIcon,
  Inbox,
} from "lucide-react";
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
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

import { TestSubmissionButton } from "@/components/forms/test-submission-button";
import CopyButton from "@/components/dashboard/copy-button";
import { FormGeneralSettings } from "@/components/forms/form-general-settings";
import { FormSpamSettings } from "@/components/forms/form-spam-settings";
import { FormNotificationsSection } from "@/components/forms/form-notifications-section";
import { FormDeleteSection } from "@/components/forms/form-delete-section";
import { ExportSubmissions } from "@/components/forms/export-submissions";
import { WebhookSection } from "@/components/forms/webhook-section";

export default async function FormOverviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");
  const { tab } = await searchParams;

  await connectDB();
  const [form, user] = await Promise.all([
    Form.findOne({
      _id: id,
      userId: session.user.id,
    }).lean(),
    User.findById(session.user.id).lean(),
  ]);

  if (!form) redirect("/forms");

  const [submissions, webhooks, submissionsCount, webhooksCount, spamCount] =
    await Promise.all([
      Submission.find({ formId: id }).sort({ createdAt: -1 }).limit(50).lean(),
      Webhook.find({ formId: id }).sort({ createdAt: -1 }).lean(),
      Submission.countDocuments({ formId: id }),
      Webhook.countDocuments({ formId: id }),
      Submission.countDocuments({ formId: id, spam: true }),
    ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const submissionsToday = await Submission.countDocuments({
    formId: id,
    createdAt: { $gte: today },
  });

  const endpoint = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/submit/${id}`;
  const globalEmails = user?.email ? [user.email] : [];

  const serializedSubmissions = submissions.map((sub) => ({
    ...sub,
    _id: String(sub._id),
    formId: String(sub.formId),
    createdAt: sub.createdAt.toISOString(),
  }));

  const serializedWebhooks = webhooks.map((webhook) => ({
    ...webhook,
    _id: String(webhook._id),
    formId: String(webhook.formId),
    createdAt: webhook.createdAt.toISOString(),
    updatedAt: webhook.updatedAt?.toISOString(),
  }));

  const exportableSubmissions = serializedSubmissions.map((sub) => ({
    id: sub._id,
    createdAt: sub.createdAt,
    spam: sub.spam || false,
    data: (sub.data as Record<string, any>) || {},
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{form.name}</h1>
          <p className="text-muted-foreground mt-1">
            Manage your form endpoint and view submissions.
          </p>
        </div>
        <TestSubmissionButton formId={id} />
      </div>

      <Tabs defaultValue={tab || "overview"} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Submissions
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissionsCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Submissions Today
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissionsToday}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Webhooks
                </CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{webhooksCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Spam Caught
                </CardTitle>
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{spamCount}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Endpoint URL</CardTitle>
              <CardAction>
                <CopyButton text={endpoint} />
              </CardAction>
            </CardHeader>
            <CardContent>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-indigo-500 break-all">
                {endpoint}
              </code>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <div className="flex justify-end">
            <ExportSubmissions submissions={exportableSubmissions} />
          </div>
          {serializedSubmissions.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No submissions yet"
              description="When users submit your form, the data will appear here."
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Data Preview</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serializedSubmissions.map((sub) => {
                    const dataObj = (sub.data ?? {}) as Record<string, string>;
                    const keys = Object.keys(dataObj);
                    const preview = keys
                      .slice(0, 2)
                      .map((k) => `${k}: ${dataObj[k]}`)
                      .join(", ");
                    const hasMore = keys.length > 2;

                    return (
                      <TableRow
                        key={String(sub._id)}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell className="whitespace-nowrap">
                          {formatDistanceToNow(new Date(sub.createdAt), {
                            addSuffix: true,
                          })}
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {preview}
                          {hasMore && (
                            <span className="text-muted-foreground">...</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {sub.spam ? (
                            <Badge variant="destructive">Spam</Badge>
                          ) : (
                            <Badge variant="secondary">Clean</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <WebhookSection formId={id} initialWebhooks={serializedWebhooks} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <FormGeneralSettings
            formId={id}
            initialData={{
              name: form.name,
              redirectSuccess: form.redirectSuccess,
              allowedOrigins: form.allowedOrigins,
            }}
          />

          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure email settings for this form independently from your
                account defaults.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormNotificationsSection
                formId={id}
                emailNotifications={form.emailNotifications ?? true}
                notificationEmails={form.notificationEmails ?? []}
                globalEmails={globalEmails}
              />
            </CardContent>
          </Card>

          <FormSpamSettings
            formId={id}
            initialData={{
              honeypotField: form.honeypotField,
            }}
          />

          <FormDeleteSection formId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
