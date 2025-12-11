import Link from "next/link";
import { getServerSession } from "next-auth";
import Logo from "@/components/shared/logo";
import { authOptions } from "@/lib/auth";
import { Button } from "../shared/button";
import MobileMenu from "./mobile-menu";
import UserMenu from "./user-menu";

interface HeaderProps {
  hideNavLinks?: boolean;
}

export default async function Header({ hideNavLinks = false }: HeaderProps) {
  const session = await getServerSession(authOptions);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm px-6 lg:px-12 p-4 lg:py-8 flex items-center justify-between border-b border-gray-100 bg-white">
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex items-center gap-4">
        <nav className="hidden sm:flex items-center gap-8">
          {!hideNavLinks && (
            <>
              <Link
                href="/#features"
                className="text-sm hover:opacity-80 transition-opacity"
              >
                Features
              </Link>

              <Link
                href="/docs"
                className="text-sm hover:opacity-80 transition-opacity"
              >
                Docs
              </Link>
            </>
          )}
          {session ? (
            <UserMenu session={session} />
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm hover:opacity-80 transition-opacity"
              >
                <Button variant="outline">Log in</Button>
              </Link>
              <Link href="/auth/register" className="text-sm font-medium">
                <Button variant="primary">Start for Free</Button>
              </Link>
            </>
          )}
        </nav>
        <MobileMenu session={session} />
      </div>
    </header>
  );
}
