"use client";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Shield,
  Mail,
  MessageSquare,
  Code2,
  Globe,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-semibold text-foreground">StaticSend</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">
                Start free
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative px-4 pb-20 pt-30 lg:pb-28 lg:pt-40">
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl"></div>
            {/* <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl"></div> */}
          </div>
          <div className="mx-auto max-w-5xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 border-emerald-100 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-3 font-mono text-base text-emerald-600 dark:text-emerald-400"
            >
              <div className="bg-emerald-300 dark:bg-emerald-500 rounded-full w-3 h-3 animate-pulse"></div>
              StaticSend
            </Badge>
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-foreground ">
              Form Submissions Without the Backend Hassle
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg md:text-xl leading-relaxed text-muted-foreground">
              A form submission backend for static websites. Add a single
              endpoint to your HTML, and get submissions delivered to your
              email, Discord, Slack, or WhatsApp — in under five minutes.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/docs">View Documentation</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="snippet" className="relative max-w-3xl mx-auto px-4">
          <p className="mb-4 text-center font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Drop into any static site
          </p>

          <div className="relative rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-zinc-900 overflow-visible shadow-lg">
            <div className="bg-gray-100 dark:bg-zinc-800 px-3 md:px-4 py-3 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                form.html
              </span>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/60 hover:bg-red-400 transition-all duration-200"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/60 hover:bg-yellow-400 transition-all duration-200"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400/60 hover:bg-emerald-400 transition-all duration-200"></div>
              </div>
            </div>
            <pre className="overflow-x-auto rounded-b-lg border border-border bg-code-bg p-5">
              <code className="font-mono text-sm leading-relaxed">
                {`<form action="https://staticsend.app/api/submit/form_id" method="POST">
  <input type="text" name="name" placeholder="Your name" required />
  <input type="email" name="email" placeholder="Your email" required />
  <textarea name="message" placeholder="Message" required />
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" />
  <button type="submit">Send</button>
</form>`}
              </code>
            </pre>
            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-auto md:w-64 max-w-xs md:max-w-none rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-zinc-900 shadow-lg overflow-hidden animate-bounce">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-800 flex items-start gap-1 p-1">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-xs md:text-sm flex gap-1 items-center text-light dark:text-emerald-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse "></div>
                    New Submission
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-0.5 md:space-y-1">
                    <div className="truncate">
                      <span className="text-gray-500 dark:text-gray-400">
                        Email:{" "}
                      </span>
                      johndoe@gmail.com
                    </div>
                    <div className="truncate">
                      <span className="text-gray-500 dark:text-gray-400">
                        Message:{" "}
                      </span>{" "}
                      Enquiry for the service
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
            No JavaScript required. Works with any HTML form.
          </p>
        </section>

        {/* Features */}
        <section className="px-4 py-20 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">
              Everything you need
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-lg border border-border bg-card p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border px-4 py-20 lg:py-24">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Ready to ship?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Connect your form in under five minutes. No credit card required.
            </p>
            <Button size="lg" className="mt-6" asChild>
              <Link href="/sign-up">
                Start building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Brand Column */}
            <div className="space-y-4 col-span-2">
              <div className="flex items-center gap-2">
                <Logo />
                <span className="font-semibold text-foreground">
                  StaticSend
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Simple form backend for static websites. No backend required.
              </p>
            </div>
            {/* Product Links */}
            {/* <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/changelog"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div> */}
            {/* Legal Links */}
            {/* <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div> */}
            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <div className="flex gap-3">
                <a
                  href="https://github.com/ShreyNagda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/in/shrey-nagda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com/its.shreyn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://youtube.com/@shreynagda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/shrey_nagda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                Built with Next.js + MongoDB. <br />
                &copy; {new Date().getFullYear()} StaticSend.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Zero-config integration",
    description:
      "Copy one endpoint URL into your form action. No SDK, no npm install, no build step. Works with plain HTML.",
    icon: Code2,
  },
  {
    title: "Multi-channel delivery",
    description:
      "Get submissions via Email, Discord, Slack, or WhatsApp. Configure as many channels per form as you need.",
    icon: Mail,
  },
  {
    title: "Spam protection built in",
    description:
      "Honeypot fields block bots silently. Optional hCaptcha integration for additional protection. No spam in your inbox.",
    icon: Shield,
  },
  {
    title: "Automatic retries",
    description:
      "Failed deliveries retry up to three times with exponential backoff. You’ll never miss a submission.",
    icon: MessageSquare,
  },
  {
    title: "Any framework, any site",
    description:
      "Static HTML, Astro, Hugo, Eleventy, Next.js, SvelteKit — if it can POST, it works.",
    icon: Globe,
  },
  {
    title: "Developer-first dashboard",
    description:
      "View submissions, inspect delivery logs, export data. Built for devs who want control without complexity.",
    icon: Zap,
  },
];
