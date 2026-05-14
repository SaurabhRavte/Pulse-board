export function extractSlug(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const m = url.pathname.match(/\/p\/([^/?#]+)/);
    if (m && m[1].length >= 4) return m[1];
  } catch {
    // not a URL
  }

  const stripped = trimmed.replace(/^\/?p\//, "");
  const slug = stripped.split("/")[0].split("?")[0].split("#")[0];
  return slug && slug.length >= 4 ? slug : null;
}
