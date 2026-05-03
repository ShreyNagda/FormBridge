import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Zap, Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Webhook Guide | StaticSend",
  description: "Learn how to set up Discord and Slack webhooks for your form notifications.",
};

export default function WebhookDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-linear-to-b from-background to-secondary/20 px-4 py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/docs">
                <ArrowLeft className="h-4 w-4" />
                Back to Docs
              </Link>
            </Button>
          </div>

          <div>
            <Badge
              variant="outline"
              className="mb-4 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400"
            >
              Integrations
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Webhook Setup Guide
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Get notified instantly in your favorite chat apps when someone submits your form.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-12">
          {/* Discord Section */}
          <section id="discord">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-500 p-2 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight">Discord Webhooks</h2>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>How to get your Discord Webhook URL</CardTitle>
                <CardDescription>Follow these simple steps to connect your Discord channel.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal pl-5 space-y-4 text-muted-foreground">
                  <li>
                    Open your <strong>Server Settings</strong> and head to the <strong>Integrations</strong> tab.
                  </li>
                  <li>
                    Click on <strong>Webhooks</strong> and then select <strong>New Webhook</strong>.
                  </li>
                  <li>
                    Give your webhook a name (e.g., "StaticSend Notifications") and choose the channel where you want messages to appear.
                  </li>
                  <li>
                    Click the <strong>Copy Webhook URL</strong> button.
                  </li>
                  <li>
                    Paste this URL into the StaticSend dashboard under the Discord webhook configuration.
                  </li>
                </ol>
                <div className="bg-muted p-4 rounded-lg flex gap-3 items-start mt-4">
                  <Info className="h-5 w-5 text-indigo-500 mt-0.5" />
                  <p className="text-sm">
                    You can also customize the bot's name and avatar directly in the StaticSend dashboard if you want something different from the Discord defaults.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Slack Section */}
          <section id="slack">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-500 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight">Slack Webhooks</h2>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>How to get your Slack Webhook URL</CardTitle>
                <CardDescription>Connect StaticSend to your Slack workspace using Incoming Webhooks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal pl-5 space-y-4 text-muted-foreground">
                  <li>
                    Go to the <a href="https://api.slack.com/apps" target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Slack App Directory <ExternalLink className="h-3 w-3" /></a> and create a new App (or use an existing one).
                  </li>
                  <li>
                    Under <strong>Add features and functionality</strong>, select <strong>Incoming Webhooks</strong>.
                  </li>
                  <li>
                    Toggle <strong>Activate Incoming Webhooks</strong> to On.
                  </li>
                  <li>
                    Click <strong>Add New Webhook to Workspace</strong> at the bottom.
                  </li>
                  <li>
                    Choose the channel you want to post to and click <strong>Allow</strong>.
                  </li>
                  <li>
                    Copy the <strong>Webhook URL</strong> and paste it into the StaticSend dashboard.
                  </li>
                </ol>
                <div className="bg-muted p-4 rounded-lg flex gap-3 items-start mt-4">
                  <Info className="h-5 w-5 text-purple-500 mt-0.5" />
                  <p className="text-sm">
                    StaticSend uses the default channel configuration of the webhook, but you can override the channel name in our dashboard if your Slack App has permission to post to multiple channels.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Troubleshooting */}
          <section className="bg-secondary/20 p-8 rounded-2xl border border-border">
            <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2">Not receiving notifications?</h3>
                <p className="text-sm text-muted-foreground">
                  Use the <strong>Test</strong> button in the StaticSend dashboard to send a dummy payload. If the test fails, check if the Webhook URL is still valid and hasn't been deleted in Discord or Slack.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Delayed messages?</h3>
                <p className="text-sm text-muted-foreground">
                  Webhook delivery usually happens within seconds. If you see delays, check the <strong>Delivery Logs</strong> in your dashboard to see if we encountered any errors or retries.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
