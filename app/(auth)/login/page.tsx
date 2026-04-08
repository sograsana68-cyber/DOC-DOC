import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-teal-700/90 dark:text-teal-400/90">
            Family Document Vault
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-muted">
            Secure access for your household. Authentication will connect here
            later.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <form className="space-y-5" action="#" method="post">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@family.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-teal-600/30 transition placeholder:text-muted focus:border-teal-600/50 focus:ring-2 dark:ring-teal-500/30"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-teal-600/30 transition placeholder:text-muted focus:border-teal-600/50 focus:ring-2 dark:ring-teal-500/30"
              />
            </div>
            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500"
            >
              Continue to vault
            </Link>
          </form>
        </div>

        <p className="text-center text-xs text-muted">
          Demo only — no data is sent yet.
        </p>
      </div>
    </div>
  );
}
