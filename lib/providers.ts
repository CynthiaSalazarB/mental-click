export type ProviderId = "gemini" | "openrouter";

export const PROVIDERS: Record<
  ProviderId,
  { label: string; baseUrl: string; model: string }
> = {
  gemini: {
    label: "Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    model: "gemini-3.5-flash-lite",
  },
  openrouter: {
    label: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    model: "google/gemma-4-31b-it",
  },
};

/** The key's prefix says who issued it. Same rule as scripts/run_prompt.py. */
export function detectProvider(key: string): ProviderId | null {
  const k = key.trim();
  if (k.startsWith("sk-or-")) return "openrouter";
  if (k.startsWith("AIza") || k.startsWith("AQ.")) return "gemini";
  return null;
}
