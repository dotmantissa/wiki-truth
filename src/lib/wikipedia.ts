function normalizeLoose(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchWikipediaExtract(pageTitle: string): Promise<string> {
  const params = new URLSearchParams({
    action: 'query',
    prop: 'extracts',
    explaintext: '1',
    redirects: '1',
    format: 'json',
    origin: '*',
    titles: pageTitle
  });

  const response = await fetch(`https://en.wikipedia.org/w/api.php?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Could not fetch Wikipedia page content.');
  }

  const payload = (await response.json()) as {
    query?: { pages?: Record<string, { extract?: string }> };
  };

  const pages = payload.query?.pages;
  if (!pages) return '';

  const firstPage = pages[Object.keys(pages)[0]];
  return firstPage?.extract ?? '';
}

export async function getWikipediaPhraseHint(
  pageTitle: string,
  expectedPhrase: string
): Promise<string | null> {
  const extract = await fetchWikipediaExtract(pageTitle);
  if (!extract) return null;

  const exactPhrase = expectedPhrase.trim();
  if (!exactPhrase) return null;

  if (extract.includes(exactPhrase)) {
    return null;
  }

  const looseExtract = normalizeLoose(extract);
  const loosePhrase = normalizeLoose(exactPhrase);

  if (loosePhrase && looseExtract.includes(loosePhrase)) {
    return 'Close match found on Wikipedia, but exact punctuation/capitalization differs. Try copying the precise snippet including commas or symbols.';
  }

  return null;
}
