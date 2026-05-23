import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "StaticSend — Form backend for static sites",
    template: "%s — StaticSend",
  },
  description:
    "Receive form submissions from your static website. No server required. Deploy in under five minutes.",
  keywords: [
    "form backend",
    "static site forms",
    "form submissions",
    "serverless forms",
    "contact form backend",
  ],
  authors: [{ name: "StaticSend" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://staticsend.vercel.app",
    siteName: "StaticSend",
    title: "StaticSend — Form backend for static sites",
    description:
      "Receive form submissions from your static website. No server required.",
    images: [
      {
        url: "https://staticsend.vercel.app/logo",
        width: 1200,
        height: 630,
        alt: "StaticSend - Form backend for static sites",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StaticSend — Form backend for static sites",
    images: [
      {
        url: "https://staticsend.vercel.app/logo",
        width: 1200,
        height: 630,
        alt: "StaticSend - Form backend for static sites",
      },
    ],
    description:
      "Receive form submissions from your static website. No server required.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("antialiased", inter.variable)}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-screen bg-background font-sans text-foreground">
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
        <Toaster
          position="bottom-right"
          closeButton
          toastOptions={{
            classNames: {
              toast:
                "bg-card text-card-foreground border border-border shadow-lg",
              success: "!border-l-[3px] !border-l-success",
              error: "!border-l-[3px] !border-l-error",
              warning: "!border-l-[3px] !border-l-warning",
              info: "!border-l-[3px] !border-l-info",
            },
          }}
        />
      </body>
    </html>
  );
}
