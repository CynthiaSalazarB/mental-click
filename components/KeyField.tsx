"use client";

import { useState } from "react";
import { PROVIDERS, detectProvider } from "@/lib/providers";

type Props = {
  savedKey: string | null;
  remember: boolean;
  onSave: (key: string, remember: boolean) => void;
  onForget: () => void;
};

export function KeyField({ savedKey, remember, onSave, onForget }: Props) {
  const [draft, setDraft] = useState("");
  const [rememberDraft, setRememberDraft] = useState(remember);
  const draftProvider = detectProvider(draft);

  if (savedKey) {
    const provider = detectProvider(savedKey);
    return (
      <section className="key key--saved" aria-labelledby="key-heading">
        <h2 id="key-heading" className="label">Your key</h2>
        <p className="key__status">
          {provider ? PROVIDERS[provider].label : "Unknown"} key
          <span className="key__dots" aria-hidden="true"> ···{savedKey.slice(-4)}</span>
          <span className="key__where">
            {remember ? "remembered on this device" : "kept for this tab only"}
          </span>
        </p>
        <button type="button" className="btn btn--quiet" onClick={onForget}>
          Forget my key
        </button>
        <KeyPolicy />
      </section>
    );
  }

  return (
    <section className="key" aria-labelledby="key-heading">
      <h2 id="key-heading" className="label">Your key</h2>
      <form
        className="key__form"
        onSubmit={(e) => {
          e.preventDefault();
          if (draftProvider) onSave(draft.trim(), rememberDraft);
        }}
      >
        <label htmlFor="api-key" className="sr-only">
          Gemini or OpenRouter API key
        </label>
        <input
          id="api-key"
          className="field key__input"
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder="Paste a Gemini or OpenRouter key"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-describedby="key-hint"
        />
        <p id="key-hint" className="key__hint" aria-live="polite">
          {draft && !draftProvider
            ? "Gemini keys start with AIza or AQ., OpenRouter keys with sk-or-."
            : draftProvider
              ? `${PROVIDERS[draftProvider].label} key detected.`
              : (
                <>
                  No key?{" "}
                  <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                    Get a free Gemini key
                  </a>{" "}
                  in two minutes.
                </>
              )}
        </p>
        <label className="check">
          <input
            type="checkbox"
            checked={rememberDraft}
            onChange={(e) => setRememberDraft(e.target.checked)}
          />
          Remember on this device
        </label>
        <button type="submit" className="btn btn--line" disabled={!draftProvider}>
          Use this key
        </button>
      </form>
      <KeyPolicy />
    </section>
  );
}

function KeyPolicy() {
  return (
    <details className="policy">
      <summary>How your key is handled</summary>
      <ul>
        <li>It stays in this browser, for this tab only unless you tick remember.</li>
        <li>It&apos;s sent over an encrypted connection to make your request, then forgotten. Never stored, never logged.</li>
        <li>No accounts, no tracking scripts.</li>
        <li>
          Safest: make a new key just for this tool (a free Gemini key, or an OpenRouter key with a
          small spending limit) and delete it whenever you like.
        </li>
      </ul>
    </details>
  );
}
