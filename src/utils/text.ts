const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  quot: '"',
  nbsp: " ",
  hellip: "...",
  ldquo: "“",
  rdquo: "”",
  lsquo: "‘",
  rsquo: "’",
  ndash: "–",
  mdash: "—",
  laquo: "«",
  raquo: "»",
};

export function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_match, code) => {
      const parsed = Number.parseInt(code, 10);
      return Number.isNaN(parsed) ? _match : String.fromCodePoint(parsed);
    })
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => {
      const parsed = Number.parseInt(code, 16);
      return Number.isNaN(parsed) ? _match : String.fromCodePoint(parsed);
    })
    .replace(/&([a-z]+);/gi, (match, entity) => NAMED_HTML_ENTITIES[entity] ?? match);
}

export function stripHtml(value: string) {
  return decodeHtmlEntities(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function normalizeExcerpt(value: string) {
  return stripHtml(value)
    .replace(/\s*\[(?:\.{3}|…)\]\s*$/u, "")
    .replace(/\s*(?:\.{3}|…)\s*$/u, "")
    .trim();
}
