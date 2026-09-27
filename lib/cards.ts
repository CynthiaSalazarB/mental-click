export type Card = {
  concept: { title: string; explanation: string; evidence: string };
  mental_model: { analogy: string; misconception: string; correction: string };
  use_case: { scenario: string; challenge: string; answer: string };
};

export type CheckedCard = Card & { evidenceVerified: boolean };

export type StudyResult = {
  cards: CheckedCard[];
  note: string | null;
  noCards: { reason: string; suggestion: string } | null;
};

const PANELS = {
  concept: ["title", "explanation", "evidence"],
  mental_model: ["analogy", "misconception", "correction"],
  use_case: ["scenario", "challenge", "answer"],
} as const;

/**
 * Find the output's JSON object wherever it sits. Gemma writes <analysis>
 * tags, Gemini writes a bare "analysis" heading and glues the { onto the
 * last line, some models add code fences. Take the last object with "cards".
 */
export function extractJson(output: string): Record<string, unknown> | null {
  let found: Record<string, unknown> | null = null;
  for (let i = output.indexOf("{"); i !== -1; i = output.indexOf("{", i + 1)) {
    const end = matchingBrace(output, i);
    if (end === -1) continue;
    try {
      const data = JSON.parse(output.slice(i, end + 1));
      if (data && typeof data === "object" && "cards" in data) found = data;
    } catch {
      // not JSON from here, keep scanning
    }
  }
  return found;
}

/** Index of the brace closing the one at `start`, respecting JSON strings. */
function matchingBrace(text: string, start: number): number {
  let depth = 0;
  let inString = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (ch === "\\") i++;
      else if (ch === '"') inString = false;
    } else if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}" && --depth === 0) return i;
  }
  return -1;
}

/** Loose comparison: drop Markdown symbols, unify quotes and whitespace. */
export function normalize(text: string): string {
  return text
    .replace(/[*_`]/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function isCard(value: unknown): value is Card {
  if (!value || typeof value !== "object") return false;
  const card = value as Record<string, Record<string, unknown>>;
  return Object.entries(PANELS).every(([panel, fields]) =>
    fields.every((f) => typeof card[panel]?.[f] === "string" && card[panel][f] !== ""),
  );
}

/** Turn raw model output into a StudyResult, or null if it is unusable. */
export function parseStudyResult(output: string, notes: string): StudyResult | null {
  const data = extractJson(output);
  if (!data) return null;

  const notesNorm = normalize(notes);
  const rawCards = Array.isArray(data.cards) ? data.cards : [];
  const cards = rawCards.filter(isCard).map((card) => ({
    ...card,
    evidenceVerified: notesNorm.includes(normalize(card.concept.evidence.replace(/^"|"$/g, ""))),
  }));

  const noCards = data.no_cards as StudyResult["noCards"];
  if (!cards.length && !(noCards && typeof noCards.reason === "string")) return null;

  return {
    cards,
    note: typeof data.note === "string" ? data.note : null,
    noCards: cards.length ? null : noCards,
  };
}
