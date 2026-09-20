import { contextBridge, ipcRenderer } from "electron";

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

contextBridge.exposeInMainWorld("electronAPI", {
  getTokens: (): Promise<StoredTokens | null> => ipcRenderer.invoke("auth:getTokens"),
  setTokens: (tokens: StoredTokens): Promise<void> => ipcRenderer.invoke("auth:setTokens", tokens),
  clearTokens: (): Promise<void> => ipcRenderer.invoke("auth:clearTokens"),
  openExternal: (url: string): Promise<void> => ipcRenderer.invoke("auth:openExternal", url),
  onAuthCallback: (callback: (fragment: string) => void): (() => void) => {
    const listener = (_event: Electron.IpcRendererEvent, fragment: string) => callback(fragment);
    ipcRenderer.on("auth:callback", listener);
    return () => {
      ipcRenderer.removeListener("auth:callback", listener);
    };
  },
});
