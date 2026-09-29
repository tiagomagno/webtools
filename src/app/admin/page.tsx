"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "../lib/auth/AuthProvider";
import { initials } from "../lib/initials";
import Breadcrumbs from "../components/Breadcrumbs";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  providers: string[];
  toolUsageCount: number;
}

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 24,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminPage() {
  const { user, authorizedFetch } = useAuth();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    let cancelled = false;
    (async () => {
      const res = await authorizedFetch("/admin/users");
      if (cancelled) return;
      if (!res.ok) {
        setError("Não foi possível carregar a lista de usuários.");
        return;
      }
      setUsers(await res.json());
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  async function handleDelete(target: AdminUser) {
    const ok = window.confirm(`Excluir a conta de ${target.name || target.email}? Isso apaga histórico e não pode ser desfeito.`);
    if (!ok) return;
    setDeletingId(target.id);
    setError(null);
    try {
      const res = await authorizedFetch(`/admin/users/${target.id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Não foi possível excluir o usuário.");
        return;
      }
      setUsers((prev) => prev?.filter((u) => u.id !== target.id) ?? prev);
    } finally {
      setDeletingId(null);
    }
  }

  if (!user) return null;

  if (user.role !== "ADMIN") {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Usuários" }]} />
        <div style={cardStyle}>
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>
            Esta página é restrita a administradores.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Usuários" }]} />
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", margin: 0 }}>Usuários</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>
          Pessoas cadastradas na plataforma webtools.
        </p>
      </div>

      <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
        {error ? (
          <p style={{ fontSize: 13, color: "#ef4444", margin: 0, padding: 24 }}>{error}</p>
        ) : !users ? (
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, padding: 24 }}>Carregando…</p>
        ) : users.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, padding: 24 }}>Nenhum usuário ainda.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Usuário", "Login", "Ferramentas usadas", "Desde", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 600,
                      color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "0.05em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {u.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={u.avatarUrl} alt="" width={32} height={32} style={{ borderRadius: "50%", flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "var(--accent)", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {initials(u.name, u.email)}
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {u.name || u.email}
                          {u.role === "ADMIN" && (
                            <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5, background: "var(--accent)", color: "#fff" }}>
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 12.5, color: "var(--text-muted)" }}>
                    {u.providers.includes("google") ? "Google" : "E-mail e senha"}
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 12.5, color: "var(--text-muted)" }}>
                    {u.toolUsageCount}
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 12.5, color: "var(--text-muted)" }}>
                    {formatDate(u.createdAt)}
                  </td>
                  <td style={{ padding: "10px 16px", textAlign: "right" }}>
                    {u.id !== user.id && (
                      <button
                        type="button"
                        onClick={() => handleDelete(u)}
                        disabled={deletingId === u.id}
                        title={`Excluir ${u.email}`}
                        aria-label={`Excluir ${u.email}`}
                        style={{
                          width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border)",
                          background: "var(--surface-2)", color: "#ef4444", display: "flex",
                          alignItems: "center", justifyContent: "center", cursor: deletingId === u.id ? "not-allowed" : "pointer",
                          opacity: deletingId === u.id ? 0.6 : 1,
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
