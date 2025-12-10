import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/shared/button";
import { FileQuestion } from "lucide-react";

export default async function NotFound() {
  const session = await getServerSession(authOptions);
  const href = session ? "/dashboard" : "/";
  const label = session ? "Back to Dashboard" : "Back to Home";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center">
            <FileQuestion className="h-12 w-12 text-gray-400" />
          </div>
        </div>

        <h1 className="text-4xl font-display font-bold text-gray-900">
          Page not found
        </h1>

        <p className="text-gray-500 text-lg">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or doesn't exist.
        </p>

        <div className="pt-4">
          <Link href={href}>
            <Button size="lg" className="w-full sm:w-auto">
              {label}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
