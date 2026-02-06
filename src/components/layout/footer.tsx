import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-primary-100 dark:border-zinc-700 bg-background dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left: Branding */}
          <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
            Powered by{" "}
            <span className="font-semibold text-primary">SODAX</span>
          </div>

          {/* Right: Placeholder Links */}
          <nav className="flex flex-wrap gap-6 justify-center">
            <Link
              href="/about"
              className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/docs"
              className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/terms"
              className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
