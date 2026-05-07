# v0.1.0
# { "Depends": "py-genlayer:latest" }

import json
from urllib.parse import quote, unquote, urlparse

from genlayer import *


class WikiTruth(gl.Contract):
    """Stores Wikipedia phrase verification results on-chain."""

    verified_facts: TreeMap[str, bool]

    def __init__(self):
        pass

    def _normalize_title(self, page_title: str) -> str:
        value = str(page_title).strip()
        if not value:
            return ""

        if value.startswith("http://") or value.startswith("https://"):
            parsed = urlparse(value)
            host = (parsed.hostname or "").lower()
            if host == "wikipedia.org" or host.endswith(".wikipedia.org"):
                if parsed.path.startswith("/wiki/") and len(parsed.path) > len("/wiki/"):
                    raw = parsed.path[len("/wiki/") :]
                    return unquote(raw).replace("_", " ").strip()

        return value

    def _fact_key(self, page_title: str, expected_phrase: str) -> str:
        normalized_title = self._normalize_title(page_title).lower().strip()
        normalized_phrase = str(expected_phrase).lower().strip()
        return f"{normalized_title}||{normalized_phrase}"

    def _fetch_wikipedia_extract(self, page_title: str) -> str:
        normalized_title = self._normalize_title(page_title)
        if not normalized_title:
            return ""

        encoded_title = quote(normalized_title, safe="")
        url = (
            "https://en.wikipedia.org/w/api.php"
            "?action=query&prop=extracts&explaintext=1&redirects=1&format=json&titles="
            f"{encoded_title}"
        )

        response = gl.nondet.web.get(url)
        body = response.body.decode("utf-8")

        payload = json.loads(body)
        pages = payload.get("query", {}).get("pages", {})
        if not isinstance(pages, dict) or len(pages) == 0:
            return ""

        first_page = pages[next(iter(pages.keys()))]
        if not isinstance(first_page, dict):
            return ""

        extract = first_page.get("extract", "")
        return str(extract)

    @gl.public.write
    def verify_fact(self, page_title: str, expected_phrase: str) -> None:
        title = self._normalize_title(page_title)
        phrase = str(expected_phrase).strip()

        if not title or not phrase:
            raise gl.UserError("page_title and expected_phrase are required")

        def leader_fn() -> bool:
            extract = self._fetch_wikipedia_extract(title)
            return phrase in extract

        # Consensus on a boolean outcome. Each validator re-runs the same fetch/check.
        is_true = gl.eq_principle.strict_eq(leader_fn)

        key = self._fact_key(title, phrase)
        self.verified_facts[key] = bool(is_true)

    @gl.public.view
    def is_fact_true(self, page_title: str, expected_phrase: str) -> bool:
        key = self._fact_key(page_title, expected_phrase)
        if key in self.verified_facts:
            return bool(self.verified_facts[key])
        return False
