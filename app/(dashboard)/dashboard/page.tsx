import Link from "next/link";

const placeholders = [
  {
    title: "Insurance",
    description: "Policies, cards, and claim paperwork.",
    count: "—",
  },
  {
    title: "Legal",
    description: "Wills, deeds, and powers of attorney.",
    count: "—",
  },
  {
    title: "Medical",
    description: "Records and vaccination lists.",
    count: "—",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Your vault
        </h1>
        <p className="mt-1 text-sm text-muted">
          Organize family documents in one place. Uploads and sharing will
          arrive with the backend.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Documents
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            0
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Folders
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            0
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Shared with family
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            —
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-sm font-medium text-foreground">Folders</h2>
        <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
          {placeholders.map((folder) => (
            <li
              key={folder.title}
              className="flex items-center justify-between gap-4 px-4 py-3 first:rounded-t-xl last:rounded-b-xl"
            >
              <div>
                <p className="font-medium text-foreground">{folder.title}</p>
                <p className="text-sm text-muted">{folder.description}</p>
              </div>
              <span className="shrink-0 rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium tabular-nums text-muted dark:bg-zinc-800">
                {folder.count} files
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-muted">
        Need to switch accounts?{" "}
        <Link href="/login" className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-400">
          Back to sign in
        </Link>
        .
      </p>
    </div>
  );
}
