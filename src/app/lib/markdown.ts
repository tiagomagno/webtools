// Conversor Markdown → HTML leve (#33), sem dependências externas.
// Cobre o subconjunto mais usado: títulos, ênfase, código, listas, citações,
// links, imagens, regras horizontais e parágrafos.

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Processa marcações inline (negrito, itálico, código, links, imagens). */
function inline(text: string): string {
  let s = escapeHtml(text);
  // Código inline (`code`) — protegido antes das demais marcações.
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  // Imagens ![alt](url)
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, url) => `<img src="${url}" alt="${alt}" />`);
  // Links [texto](url)
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${t}</a>`);
  // Negrito **texto** ou __texto__
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/__([^_]+)__/g, "<strong>$1</strong>");
  // Itálico *texto* ou _texto_
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/_([^_]+)_/g, "<em>$1</em>");
  // Quebra de linha forçada (dois espaços no fim)
  s = s.replace(/ {2}\n/g, "<br />\n");
  return s;
}

/** Converte uma string Markdown em HTML. */
export function markdownToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;

  type ListType = "ul" | "ol" | null;
  let listType: ListType = null;
  const closeList = () => { if (listType) { out.push(`</${listType}>`); listType = null; } };

  while (i < lines.length) {
    const line = lines[i];

    // Bloco de código cercado ```
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      closeList();
      const lang = fence[1];
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++; // pula o fechamento
      const cls = lang ? ` class="language-${lang}"` : "";
      out.push(`<pre><code${cls}>${escapeHtml(buf.join("\n"))}</code></pre>`);
      continue;
    }

    // Linha em branco
    if (/^\s*$/.test(line)) { closeList(); i++; continue; }

    // Regra horizontal
    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) { closeList(); out.push("<hr />"); i++; continue; }

    // Títulos
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2].trim())}</h${level}>`);
      i++;
      continue;
    }

    // Citação (>)
    if (/^\s*>\s?/.test(line)) {
      closeList();
      const buf: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^\s*>\s?/, "")); i++; }
      out.push(`<blockquote>${inline(buf.join(" "))}</blockquote>`);
      continue;
    }

    // Lista não ordenada
    if (/^\s*[-*+]\s+/.test(line)) {
      if (listType !== "ul") { closeList(); out.push("<ul>"); listType = "ul"; }
      out.push(`<li>${inline(line.replace(/^\s*[-*+]\s+/, ""))}</li>`);
      i++;
      continue;
    }

    // Lista ordenada
    if (/^\s*\d+\.\s+/.test(line)) {
      if (listType !== "ol") { closeList(); out.push("<ol>"); listType = "ol"; }
      out.push(`<li>${inline(line.replace(/^\s*\d+\.\s+/, ""))}</li>`);
      i++;
      continue;
    }

    // Parágrafo: agrupa linhas consecutivas de texto.
    closeList();
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^(#{1,6}\s|```|\s*>|\s*[-*+]\s|\s*\d+\.\s)/.test(lines[i]) &&
      !/^\s*([-*_])\1{2,}\s*$/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(buf.join("\n"))}</p>`);
  }

  closeList();
  return out.join("\n");
}
