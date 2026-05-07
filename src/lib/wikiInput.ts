export function extractWikipediaPageTitle(input: string): string {
  const value = input.trim();
  if (!value) return '';

  try {
    const url = new URL(value);
    const isWikipediaHost =
      url.hostname === 'wikipedia.org' || url.hostname.endsWith('.wikipedia.org');

    if (!isWikipediaHost) return value;

    const match = url.pathname.match(/^\/wiki\/(.+)$/);
    if (!match?.[1]) return value;

    const rawTitle = match[1].split('#')[0];
    return decodeURIComponent(rawTitle).replace(/_/g, ' ').trim();
  } catch {
    return value;
  }
}
