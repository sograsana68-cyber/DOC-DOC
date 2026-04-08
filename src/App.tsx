import {
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

type FamilyMember = {
  id: string;
  name: string;
  relationship: string;
};

type DocumentItem = {
  id: string;
  title: string;
  type: string;
  uploadedAt: Date;
};

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

function fileTypeLabel(file: File): string {
  if (file.type) {
    const short = file.type.split("/").pop() ?? file.type;
    return short.toUpperCase();
  }
  const ext = file.name.split(".").pop();
  return ext ? ext.toUpperCase() : "FILE";
}

export default function App() {
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [memberName, setMemberName] = useState("");
  const [relationship, setRelationship] = useState("");

  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const addMember = (e: FormEvent) => {
    e.preventDefault();
    const name = memberName.trim();
    const rel = relationship.trim();
    if (!name) return;
    setMembers((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        relationship: rel || "Family",
      },
    ]);
    setMemberName("");
    setRelationship("");
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const onFilesSelected = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;
      const next: DocumentItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        next.push({
          id: crypto.randomUUID(),
          title: file.name.replace(/\.[^/.]+$/, "") || file.name,
          type: fileTypeLabel(file),
          uploadedAt: new Date(),
        });
      }
      setDocuments((prev) => [...next, ...prev]);
      e.target.value = "";
    },
    [],
  );

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              DOC-DOC
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Family documents dashboard
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/50">
            <h2 className="text-base font-semibold text-slate-900">
              Add family member
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Keep track of who belongs on this account.
            </p>
            <form onSubmit={addMember} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor={`${formId}-name`}
                  className="block text-sm font-medium text-slate-700"
                >
                  Name
                </label>
                <input
                  id={`${formId}-name`}
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-400/30 transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2"
                />
              </div>
              <div>
                <label
                  htmlFor={`${formId}-rel`}
                  className="block text-sm font-medium text-slate-700"
                >
                  Relationship{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  id={`${formId}-rel`}
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="e.g. Spouse, Child"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-400/30 transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Add family member
              </button>
            </form>

            {members.length > 0 && (
              <ul className="mt-6 space-y-2 border-t border-slate-100 pt-5">
                {members.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm"
                  >
                    <div>
                      <span className="font-medium text-slate-800">
                        {m.name}
                      </span>
                      <span className="ml-2 text-slate-500">{m.relationship}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMember(m.id)}
                      className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/50">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Documents
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Upload PDFs, images, or other files. Shown newest first.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={onFilesSelected}
                aria-label="Upload documents"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 sm:mt-0"
              >
                <svg
                  className="h-4 w-4 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Upload document
              </button>
            </div>

            {documents.length === 0 ? (
              <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-14 text-center">
                <p className="text-sm font-medium text-slate-600">
                  No documents yet
                </p>
                <p className="mt-1 max-w-xs text-sm text-slate-500">
                  Use the button above to add files. They will appear in a grid
                  below.
                </p>
              </div>
            ) : (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="group flex flex-col rounded-xl border border-slate-200 bg-slate-50/30 p-4 transition hover:border-slate-300 hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900">
                          {doc.title}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="inline-flex rounded-md bg-white px-2 py-0.5 font-medium text-slate-600 ring-1 ring-slate-200/80">
                            {doc.type}
                          </span>
                          <span>{formatDate(doc.uploadedAt)}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteDocument(doc.id)}
                        className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete document"
                        aria-label={`Delete ${doc.title}`}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.75}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
