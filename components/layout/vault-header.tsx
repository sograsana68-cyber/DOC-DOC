import Link from "next/link";

export function VaultHeader() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-xs font-bold text-white dark:bg-teal-600"
            aria-hidden
          >
            FD
          </span>
          <span>Family Document Vault</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/dashboard"
            className="text-muted transition hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-border px-3 py-1.5 text-muted transition hover:border-teal-600/40 hover:text-foreground"
          >
            Sign out
          </Link>
        </nav>
      </div>
    </header>
  );
}
