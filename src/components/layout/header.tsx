import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Button from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-100 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg">
              S
            </div>
            <span className="text-xl font-bold text-text-primary">
              {APP_NAME}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Swap
            </Link>
            <Link
              href="/pools"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Pools
            </Link>
            <Link
              href="/portfolio"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Portfolio
            </Link>
          </nav>

          {/* Wallet Connection (Placeholder) */}
          <div>
            <Button>Connect Wallet</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
