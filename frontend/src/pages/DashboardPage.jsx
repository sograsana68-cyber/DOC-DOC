import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import * as familyApi from "../api/family.js";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [members, setMembers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [docs, setDocs] = useState(null);
  const [docsLoading, setDocsLoading] = useState(false);
  const [docsError, setDocsError] = useState("");
  const [membersError, setMembersError] = useState("");
  const [membersLoading, setMembersLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    familyApi
      .fetchFamilyMembers()
      .then((data) => {
        if (!cancelled) {
          setMembers(data);
          setSelectedId((prev) => (prev == null && data.length ? data[0].id : prev));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setMembersError(
            err.response?.data?.error || err.message || "Could not load family members"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setMembersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadDocuments = useCallback(async (memberId) => {
    if (!memberId) return;
    setDocsLoading(true);
    setDocsError("");
    try {
      const data = await familyApi.fetchMemberDocuments(memberId);
      setDocs(data);
    } catch (err) {
      setDocs(null);
      setDocsError(
        err.response?.data?.error || err.message || "Could not load documents"
      );
    } finally {
      setDocsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadDocuments(selectedId);
    }
  }, [selectedId, loadDocuments]);

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>DOC-DOC</span>
        </div>
        <div className={styles.sidebarHead}>Family</div>
        {membersLoading ? (
          <p className={styles.muted}>Loading…</p>
        ) : membersError ? (
          <p className={styles.err}>{membersError}</p>
        ) : (
          <ul className={styles.memberList}>
            {members.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className={
                    m.id === selectedId ? styles.memberBtnActive : styles.memberBtn
                  }
                  onClick={() => setSelectedId(m.id)}
                >
                  <span className={styles.memberName}>{m.name}</span>
                  <span className={styles.memberRel}>{m.relation}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
      <main className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Documents</h1>
            {user ? (
              <p className={styles.userLine}>
                Signed in as <strong>{user.email}</strong>
              </p>
            ) : null}
          </div>
          <button type="button" className={styles.outBtn} onClick={logout}>
            Sign out
          </button>
        </header>
        <section className={styles.content}>
          {docsLoading ? (
            <p className={styles.muted}>Loading documents…</p>
          ) : docsError ? (
            <p className={styles.err}>{docsError}</p>
          ) : docs ? (
            <>
              <h2 className={styles.docsTitle}>{docs.memberName}</h2>
              <ul className={styles.docList}>
                {docs.documents.length === 0 ? (
                  <li className={styles.muted}>No documents yet.</li>
                ) : (
                  docs.documents.map((d) => (
                    <li key={d.id} className={styles.docCard}>
                      <span className={styles.docTitle}>{d.title}</span>
                      <span className={styles.docMeta}>Updated {d.updatedAt}</span>
                    </li>
                  ))
                )}
              </ul>
            </>
          ) : (
            <p className={styles.muted}>Select a family member to see documents.</p>
          )}
        </section>
      </main>
    </div>
  );
}
