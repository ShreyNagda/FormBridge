import Link from "next/link";
import { Button } from "@/components/shared/button";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-16 lg:py-24 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          Ready to streamline your forms?
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 lg:mb-10 max-w-2xl mx-auto">
          Join other developers who trust StaticSend for their static site form
          handling. Set up your first form in less than 2 minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg">
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          No credit card required · Free tier available · Cancel anytime
        </p>
      </div>
    </section>
  );
}
