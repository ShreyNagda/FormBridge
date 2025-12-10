import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/session-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "FormBridge",
  description: "Backendless form endpoints for your static sites",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased `}>
        <AuthProvider>
          {children}
          <ToastContainer
            position="bottom-right"
            hideProgressBar
            closeOnClick
            closeButton
            autoClose={1000}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
