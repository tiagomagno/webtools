export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenStorage {
  get(): Promise<TokenPair | null>;
  set(tokens: TokenPair): Promise<void>;
  clear(): Promise<void>;
}

const WEB_STORAGE_KEY = "wt-auth-tokens";

// Web: localStorage. Não é o ideal contra XSS, mas evita a complexidade de
// cookie cross-origin (o front é export estático numa origem, a API mora em
// outra) e é o que o Electron também precisaria replicar de qualquer forma.
const webTokenStorage: TokenStorage = {
  async get() {
    try {
      const raw = localStorage.getItem(WEB_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as TokenPair) : null;
    } catch {
      return null;
    }
  },
  async set(tokens) {
    try {
      localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(tokens));
    } catch {
      // localStorage indisponível (modo privado etc.) — sessão vira só em memória.
    }
  },
  async clear() {
    try {
      localStorage.removeItem(WEB_STORAGE_KEY);
    } catch {
      // ignora
    }
  },
};

// Electron: delega pro preload, que usa `safeStorage` (criptografado em disco)
// em vez de localStorage puro.
function createElectronTokenStorage(bridge: NonNullable<Window["electronAPI"]>): TokenStorage {
  return {
    get: () => bridge.getTokens(),
    set: (tokens) => bridge.setTokens(tokens),
    clear: () => bridge.clearTokens(),
  };
}

export function getTokenStorage(): TokenStorage {
  if (typeof window !== "undefined" && window.electronAPI) {
    return createElectronTokenStorage(window.electronAPI);
  }
  return webTokenStorage;
}

export function isElectron(): boolean {
  return typeof window !== "undefined" && Boolean(window.electronAPI);
}
