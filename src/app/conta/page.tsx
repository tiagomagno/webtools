"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../lib/auth/AuthProvider";
import { initials } from "../lib/initials";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  fontSize: 15,
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  background: "var(--accent)",
  color: "#fff",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 24,
};

export default function ContaPage() {
  const { user, logout, setPassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const isGoogleLinked = user.providers.includes("google");

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 8) {
      setError("A nova senha precisa ter pelo menos 8 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setSaving(true);
    try {
      await setPassword(newPassword, user!.hasPassword ? currentPassword : undefined);
      setSuccess(user!.hasPassword ? "Senha alterada com sucesso" : "Senha definida com sucesso");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar a senha");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", margin: 0 }}>Minha conta</h1>

      {/* Perfil */}
      <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 16 }}>
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt=""
            width={56}
            height={56}
            style={{ borderRadius: "50%", flexShrink: 0 }}
          />
        ) : (
          <div
            style={{
              width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
              background: "var(--accent)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 700,
            }}
          >
            {initials(user.name, user.email)}
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>
            {user.name || user.email}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{user.email}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {isGoogleLinked && (
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                Conectado ao Google
              </span>
            )}
            {user.hasPassword && (
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                Senha local ativa
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => void logout()}
          title="Sair da conta"
          aria-label="Sair da conta"
          style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* Senha */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>
          {user.hasPassword ? "Alterar senha" : "Definir senha"}
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 16px" }}>
          {user.hasPassword
            ? "Troque a senha usada para entrar sem o Google."
            : isGoogleLinked
              ? "Você entra hoje só com o Google. Defina uma senha se também quiser poder entrar com e-mail e senha."
              : "Defina uma senha para sua conta."}
        </p>

        <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {user.hasPassword && (
            <input
              type="password"
              placeholder="Senha atual"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={inputStyle}
            />
          )}
          <input
            type="password"
            placeholder="Nova senha"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
          />

          {error && <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{error}</p>}
          {success && <p style={{ color: "#22c55e", fontSize: 13, margin: 0 }}>{success}</p>}

          <button type="submit" disabled={saving} style={{ ...buttonStyle, opacity: saving ? 0.7 : 1, alignSelf: "flex-start" }}>
            {saving ? "Salvando…" : "Salvar senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
