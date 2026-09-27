"use client";

import { forwardRef } from "react";

/** Locate a quote in the notes, tolerating whitespace and Markdown symbols. */
export function findQuote(notes: string, quote: string): [number, number] | null {
  const words = quote.replace(/^"|"$/g, "").replace(/[*_`]/g, "").trim().split(/\s+/);
  if (!words[0]) return null;
  const escaped = words.map((w) =>
    w
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/["“”]/g, '["“”]')
      .replace(/['‘’]/g, "['‘’]"),
  );
  const match = new RegExp(escaped.join("[\\s*_`]+"), "i").exec(notes);
  return match ? [match.index, match.index + match[0].length] : null;
}

type Props = { notes: string; highlight: string | null };

// Plain text rendering only: pasted notes are never interpreted as HTML.
export const NotesView = forwardRef<HTMLElement, Props>(function NotesView(
  { notes, highlight },
  ref,
) {
  const range = highlight ? findQuote(notes, highlight) : null;
  return (
    <section className="notes-view" aria-labelledby="notes-heading" ref={ref} tabIndex={-1}>
      <h2 id="notes-heading" className="label">Your notes</h2>
      <div className="notes-view__text">
        {range ? (
          <>
            {notes.slice(0, range[0])}
            <mark>{notes.slice(range[0], range[1])}</mark>
            {notes.slice(range[1])}
          </>
        ) : (
          notes
        )}
      </div>
    </section>
  );
});
