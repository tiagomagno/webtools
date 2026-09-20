export interface ElectronAuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Implementado no preload do app Electron (webtools/electron), exposto via
// contextBridge. Ausente no navegador normal — é assim que detectamos se
// estamos rodando dentro do app desktop.
export interface ElectronAuthBridge {
  getTokens(): Promise<ElectronAuthTokens | null>;
  setTokens(tokens: ElectronAuthTokens): Promise<void>;
  clearTokens(): Promise<void>;
  openExternal(url: string): Promise<void>;
  onAuthCallback(callback: (fragment: string) => void): () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAuthBridge;
  }
}
