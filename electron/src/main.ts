import { app, BrowserWindow, ipcMain, safeStorage, shell } from "electron";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const PROTOCOL = "webtools";

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

function tokensFilePath(): string {
  return path.join(app.getPath("userData"), "auth-tokens.enc");
}

function rendererRootDir(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, "web")
    : path.join(__dirname, "..", "..", "out");
}

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".map": "application/json; charset=utf-8",
};

// O export estático do Next referencia assets por caminho absoluto
// (/_next/...), que quebra sob file:// (o Chromium busca a partir da raiz
// do disco, não da pasta do HTML). Por isso servimos o export por um
// servidor HTTP local mínimo — só lê arquivo do disco, sem watch nem build,
// nada a ver com o bug do Turbopack que travava o PC no dev server.
function startStaticServer(rootDir: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
      const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
      let filePath = path.join(rootDir, safePath === "/" ? "index.html" : safePath);

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        const asHtml = `${filePath}.html`;
        const asIndex = path.join(filePath, "index.html");
        if (fs.existsSync(asHtml)) filePath = asHtml;
        else if (fs.existsSync(asIndex)) filePath = asIndex;
        else filePath = path.join(rootDir, "404.html");
      }

      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      res.writeHead(200, { "Content-Type": MIME_TYPES[path.extname(filePath)] ?? "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    });

    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve(typeof address === "object" && address ? address.port : 0);
    });
  });
}

let mainWindow: BrowserWindow | null = null;

function sendAuthCallback(fragment: string) {
  mainWindow?.webContents.send("auth:callback", fragment);
}

// O backend redireciona o login do Google pra webtools://auth#access=...&refresh=...
// depois de concluído no navegador do sistema (o Google bloqueia login dentro de
// uma BrowserWindow embutida). Isso chega aqui via argv (Windows) ou open-url (mac).
function extractFragmentFromProtocolUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== `${PROTOCOL}:`) return null;
    return parsed.hash.replace(/^#/, "");
  } catch {
    return null;
  }
}

function handleProtocolArgv(argv: string[]) {
  const url = argv.find((arg) => arg.startsWith(`${PROTOCOL}://`));
  if (!url) return;
  const fragment = extractFragmentFromProtocolUrl(url);
  if (fragment) sendAuthCallback(fragment);
}

async function createWindow() {
  const port = await startStaticServer(rendererRootDir());

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  mainWindow.loadURL(`http://127.0.0.1:${port}/`);
}

if (!app.isDefaultProtocolClient(PROTOCOL)) {
  app.setAsDefaultProtocolClient(PROTOCOL);
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, argv) => {
    handleProtocolArgv(argv);
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on("open-url", (event, url) => {
    event.preventDefault();
    const fragment = extractFragmentFromProtocolUrl(url);
    if (fragment) sendAuthCallback(fragment);
  });

  app.whenReady().then(() => {
    void createWindow();
    handleProtocolArgv(process.argv);

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) void createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}

// ── IPC: storage seguro de token (safeStorage, criptografado em disco) ─────

ipcMain.handle("auth:getTokens", async (): Promise<StoredTokens | null> => {
  try {
    if (!safeStorage.isEncryptionAvailable()) return null;
    const encrypted = fs.readFileSync(tokensFilePath());
    return JSON.parse(safeStorage.decryptString(encrypted)) as StoredTokens;
  } catch {
    return null;
  }
});

ipcMain.handle("auth:setTokens", async (_event, tokens: StoredTokens) => {
  if (!safeStorage.isEncryptionAvailable()) return;
  const encrypted = safeStorage.encryptString(JSON.stringify(tokens));
  fs.writeFileSync(tokensFilePath(), encrypted);
});

ipcMain.handle("auth:clearTokens", async () => {
  try {
    fs.unlinkSync(tokensFilePath());
  } catch {
    // já não existe — ok
  }
});

ipcMain.handle("auth:openExternal", async (_event, url: string) => {
  await shell.openExternal(url);
});
