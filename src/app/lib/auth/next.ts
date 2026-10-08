// Para onde voltar depois do login. O login agora é opcional: o usuário sai de uma
// ferramenta, clica em "Entrar" e deve voltar a ela. O destino só pode ser um caminho
// interno do site, para o parâmetro `next` não virar redirecionamento aberto.

const STORAGE_KEY = "wt-next";

/** Devolve o caminho se for interno e seguro; senão, null. */
export function safeNextPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  // Precisa ser caminho absoluto do próprio site: "/x", nunca "//host", "/\host" ou "http://...".
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return null;
  // Sem caracteres de controle nem quebra de linha.
  if (/[\u0000-\u001f\u007f]/.test(raw)) return null;
  // Não volta para as telas de login.
  if (raw === "/login" || raw.startsWith("/login?") || raw.startsWith("/auth/")) return null;
  return raw;
}

/** Endereço do login que, depois de entrar, volta para `path`. */
export function loginHref(path: string): string {
  const next = safeNextPath(path);
  return next && next !== "/" ? `/login?next=${encodeURIComponent(next)}` : "/login";
}

/** Guarda o destino (o login com Google sai do site e volta pelo /auth/callback). */
export function rememberNext(raw: string | null | undefined): void {
  const next = safeNextPath(raw);
  if (!next) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, next);
  } catch {
    // sessionStorage indisponível: volta para a home.
  }
}

/** Lê e apaga o destino guardado. Sempre devolve um caminho seguro. */
export function consumeNext(): string {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    return safeNextPath(stored) ?? "/";
  } catch {
    return "/";
  }
}
