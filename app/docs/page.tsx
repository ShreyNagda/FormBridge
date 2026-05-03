// app/docs/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  Mail,
  MessageSquare,
  Shield,
  Zap,
  ArrowLeft,
  Info,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/code-block";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Documentation | StaticSend",
  description:
    "Simple form backend for static sites. API reference, examples for HTML, JavaScript, React, Python, and more.",
};

export default async function DocsPage({
  searchParams,
}: {
  searchParams: Promise<{ callback?: string; tab?: string }>;
}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://staticsend.vercel.app";
  const endpointUrl = `${baseUrl}/api/submit/YOUR_FORM_ID`;
  const { callback, tab } = await searchParams;

  const defaultTab = tab || "api";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-linear-to-b from-background to-secondary/20 px-4 py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          {/* Back to Home Button */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href={callback === "dashboard" ? "/dashboard" : "/"}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <Badge
                variant="outline"
                className="mb-4 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
              >
                Documentation
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                StaticSend Docs
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                Learn how to integrate StaticSend into your project and
                configure powerful notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <Tabs
          defaultValue={defaultTab}
          orientation="vertical"
          className="flex flex-col md:flex-row gap-12"
        >
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 px-4 uppercase tracking-wider">
                Documentation
              </h3>
              <TabsList className="flex flex-col w-full h-auto bg-transparent border-none p-0 items-start gap-1">
                <TabsTrigger
                  value="api"
                  className="w-full justify-start py-2.5 px-4 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-muted"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  API Reference
                </TabsTrigger>
                <TabsTrigger
                  value="webhooks"
                  className="w-full justify-start py-2.5 px-4 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-muted"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Webhook Setup
                </TabsTrigger>
              </TabsList>
            </div>
          </aside>

          <div className="flex-1 w-full min-w-0">
            <TabsContent
              value="api"
              className="space-y-12 animate-in fade-in duration-500"
            >
              {/* Quick Start */}
              <section id="quick-start">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-4">
                  Quick Start
                </h2>
                <p className="text-muted-foreground mb-6">
                  Every form gets a unique endpoint. Replace{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
                    YOUR_FORM_ID
                  </code>{" "}
                  with your actual form ID from the dashboard.
                </p>
                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-semibold">Endpoint URL</h3>
                  </div>
                  <code className="block rounded bg-muted p-3 font-mono text-sm break-all">
                    {endpointUrl}
                  </code>
                </div>
              </section>

              {/* Examples with Tabs */}
              <section id="examples">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">
                  Integration Examples
                </h2>

                <Tabs defaultValue="html" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-8">
                    <TabsTrigger value="html">HTML</TabsTrigger>
                    <TabsTrigger value="js">JavaScript</TabsTrigger>
                    <TabsTrigger value="react">React</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>

                  <TabsContent value="html">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        The simplest way: just set your form's{" "}
                        <code className="rounded bg-muted px-1 font-mono text-sm">
                          action
                        </code>{" "}
                        attribute.
                      </p>
                      <CodeBlock
                        language="html"
                        code={`<form action="${endpointUrl}" method="POST">
  <input type="email" name="email" placeholder="Your email" required />
  <textarea name="message" placeholder="Your message"></textarea>
  <button type="submit">Send</button>
</form>`}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="js">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Submit asynchronously with the Fetch API. Perfect for
                        SPAs or custom validation.
                      </p>
                      <CodeBlock
                        language="javascript"
                        code={`const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = {
    email: "user@example.com",
    message: "Hello world!"
  };

  try {
    const response = await fetch("${endpointUrl}", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Form submitted successfully!");
    }
  } catch (error) {
    console.error("Submission error:", error);
  }
};`}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="react">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        React component with loading and success states.
                      </p>
                      <CodeBlock
                        language="jsx"
                        code={`import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("${endpointUrl}", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send'}
      </button>
      {status === 'success' && <p>Message sent!</p>}
      {status === 'error' && <p>Something went wrong.</p>}
    </form>
  );
}`}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="python">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Send submissions from your backend scripts or automation
                        tools.
                      </p>
                      <CodeBlock
                        language="python"
                        code={`import requests

url = "${endpointUrl}"
data = {
    "email": "user@example.com",
    "message": "Hello from Python!"
}

response = requests.post(url, json=data)

if response.status_code == 200:
    print("Success!")
else:
    print("Error:", response.text)`}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="curl">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Test your endpoint directly from the command line.
                      </p>
                      <CodeBlock
                        language="bash"
                        code={`curl -X POST ${endpointUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com", "message": "Hello from terminal"}'`}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </section>

              {/* How It Works */}
              <section id="how-it-works">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">
                  How It Works
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-border p-5">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Mail className="h-5 w-5 text-emerald-600" />{" "}
                      Multi-Channel Delivery
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Get submissions via Discord or Slack. Configure multiple
                      channels per form.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-5">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Shield className="h-5 w-5 text-emerald-600" /> Spam
                      Protection
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Built-in honeypot fields block bots. Optional hCaptcha for
                      advanced protection.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-5">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-emerald-600" />{" "}
                      Automatic Retries
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Failed deliveries retry up to 3 times with exponential
                      backoff.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-5">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-emerald-600" /> Dashboard &
                      Logs
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      View all submissions, inspect delivery logs, and export
                      your data.
                    </p>
                  </div>
                </div>
              </section>

              {/* Spam Protection Details */}
              <section id="spam-protection">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-4">
                  Spam Protection
                </h2>
                <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                  <p>
                    StaticSend includes automatic spam filtering using a
                    honeypot technique:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Add a hidden field named{" "}
                      <code className="rounded bg-muted px-1 font-mono text-sm">
                        _gotcha
                      </code>{" "}
                      to your form
                    </li>
                    <li>Bots that fill this field will be silently rejected</li>
                    <li>Real users never see or interact with this field</li>
                  </ul>
                  <CodeBlock
                    language="html"
                    code={`<input type="text" name="_gotcha" style="display:none" tabindex="-1" />`}
                  />
                  <p>
                    For additional protection, you can enable hCaptcha in your
                    form dashboard.
                  </p>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6 divide-y divide-border">
                  {faqItems.map((item, idx) => (
                    <div key={idx} className="pt-4 first:pt-0">
                      <h3 className="font-medium text-foreground mb-2">
                        {item.question}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent
              value="webhooks"
              className="space-y-12 animate-in fade-in duration-500"
            >
              {/* Discord Section */}
              <section id="discord">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-black p-2 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">
                    Discord Webhooks
                  </h2>
                </div>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>How to get your Discord Webhook URL</CardTitle>
                    <CardDescription>
                      Follow these simple steps to connect your Discord channel.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ol className="list-decimal pl-5 space-y-4 text-muted-foreground">
                      <li>
                        Open your <strong>Server Settings</strong> and head to
                        the <strong>Integrations</strong> tab.
                      </li>
                      <li>
                        Click on <strong>Webhooks</strong> and then select{" "}
                        <strong>New Webhook</strong>.
                      </li>
                      <li>
                        Give your webhook a name (e.g., "StaticSend
                        Notifications") and choose the channel where you want
                        messages to appear.
                      </li>
                      <li>
                        Click the <strong>Copy Webhook URL</strong> button.
                      </li>
                      <li>
                        Paste this URL into the StaticSend dashboard under the
                        Discord webhook configuration.
                      </li>
                    </ol>
                    <div className="bg-muted p-4 rounded-lg flex gap-3 items-center mt-4">
                      <Info size={20} />
                      <p className="text-sm">
                        You can also customize the bot's name and avatar
                        directly in the StaticSend dashboard if you want
                        something different from the Discord defaults.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Slack Section */}
              <section id="slack">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-black p-2 rounded-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">
                    Slack Webhooks
                  </h2>
                </div>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>How to get your Slack Webhook URL</CardTitle>
                    <CardDescription>
                      Connect StaticSend to your Slack workspace using Incoming
                      Webhooks.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ol className="list-decimal pl-5 space-y-4 text-muted-foreground">
                      <li>
                        Go to the{" "}
                        <a
                          href="https://api.slack.com/apps"
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Slack App Directory{" "}
                          <ExternalLink className="h-3 w-3" />
                        </a>{" "}
                        and create a new App (or use an existing one).
                      </li>
                      <li>
                        Under <strong>Add features and functionality</strong>,
                        select <strong>Incoming Webhooks</strong>.
                      </li>
                      <li>
                        Toggle <strong>Activate Incoming Webhooks</strong> to
                        On.
                      </li>
                      <li>
                        Click <strong>Add New Webhook to Workspace</strong> at
                        the bottom.
                      </li>
                      <li>
                        Choose the channel you want to post to and click{" "}
                        <strong>Allow</strong>.
                      </li>
                      <li>
                        Copy the <strong>Webhook URL</strong> and paste it into
                        the StaticSend dashboard.
                      </li>
                    </ol>
                    <div className="bg-muted p-4 rounded-lg flex gap-3 items-center mt-4">
                      <Info className="" size={20} />
                      <p className="text-sm">
                        You can use the default channel for the webhook or
                        change the channel in our dashboard if your Slack App
                        has permission to post to multiple channels.
                      </p>
                    </div>
                    {/* <div className="bg-muted p-4 rounded-lg flex gap-3 items-center mt-4">
                      <Info className="h-6 w-6 mt-0.5" />
                      <p className="text-sm">
                        StaticSend uses the default channel configuration of the
                        webhook, but you can override the channel name in our
                        dashboard if your Slack App has permission to post to
                        multiple channels.
                      </p>
                    </div> */}
                  </CardContent>
                </Card>
              </section>

              {/* Troubleshooting */}
              <section className="bg-secondary/20 p-8 rounded-2xl border border-border">
                <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium mb-2">
                      Not receiving notifications?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Use the <strong>Test</strong> button in the StaticSend
                      dashboard to send a dummy payload. If the test fails,
                      check if the Webhook URL is still valid and hasn't been
                      deleted in Discord or Slack.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Delayed messages?</h3>
                    <p className="text-sm text-muted-foreground">
                      Webhook delivery usually happens within seconds. If you
                      see delays, check the <strong>Delivery Logs</strong> in
                      your dashboard to see if we encountered any errors or
                      retries.
                    </p>
                  </div>
                </div>
              </section>
            </TabsContent>
          </div>
        </Tabs>

        {/* CTA */}
        <section className="mt-16 rounded-lg bg-secondary/30 p-8 text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            Ready to simplify your forms?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Get started in minutes, no credit card required.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button asChild>
              <Link href="/sign-up">Create Free Account</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

const faqItems = [
  {
    question: "What happens to my data?",
    answer:
      "Submissions are stored securely in MongoDB. You can view and export them anytime from your dashboard. Data is never shared with third parties.",
  },
  {
    question: "Is there a free tier?",
    answer:
      "Yes! The free tier includes 100 submissions per month. Paid plans offer higher limits and priority support.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Currently, forms submit to staticsend.vercel.app. Custom domains are on the roadmap.",
  },
  {
    question: "Which frameworks are supported?",
    answer:
      "Any framework that can send HTTP POST requests — static HTML, React, Vue, Svelte, Astro, Next.js, Python, PHP, and more.",
  },
];
