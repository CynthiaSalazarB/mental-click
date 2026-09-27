"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import type { StudyResult } from "@/lib/cards";
import { ERROR_COPY, SAMPLE_NOTES } from "@/lib/copy";
import { forgetKey, keySnapshot, saveKey, subscribeKey } from "@/lib/key-storage";
import { CardView } from "./CardView";
import { KeyField } from "./KeyField";
import { NotesView } from "./NotesView";

const MAX_CHARS = 40_000;

export function StudyApp() {
  const snapshot = useSyncExternalStore(subscribeKey, keySnapshot, () => "");
  const remember = snapshot.startsWith("1|");
  const key = snapshot ? snapshot.slice(2) : null;
  const [notes, setNotes] = useState("");
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StudyResult | null>(null);
  const [active, setActive] = useState(0);
  const [highlight, setHighlight] = useState<string | null>(null);
  const notesRef = useRef<HTMLElement>(null);

  async function generate() {
    if (!key || !notes.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-key": key },
        body: JSON.stringify({ notes, cards: count }),
      });
      const data = await res.json().catch(() => ({ error: "bad_output" }));
      if (!res.ok) {
        setError(ERROR_COPY[data.error] ?? ERROR_COPY.bad_output);
        return;
      }
      setResult(data as StudyResult);
      setActive(0);
      setHighlight(null);
    } catch {
      setError(ERROR_COPY.network);
    } finally {
      setLoading(false);
    }
  }

  function startOver() {
    setResult(null);
    setHighlight(null);
  }

  const keyField = (
    <KeyField
      savedKey={key}
      remember={remember}
      onSave={saveKey}
      onForget={forgetKey}
    />
  );

  if (result) {
    const card = result.cards[active];
    return (
      <main className="shell">
        <div className="result-bar">
          <button type="button" className="btn btn--quiet" onClick={startOver}>
            &larr; New notes
          </button>
          {result.cards.length > 1 && (
            <div className="tabs" role="tablist" aria-label="Concepts">
              {result.cards.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  className="tab"
                  onClick={() => {
                    setActive(i);
                    setHighlight(null);
                  }}
                >
                  <span className="tab__n">{i + 1}</span> {c.concept.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {result.note && <p className="notice">{result.note}</p>}

        {card ? (
          <CardView
            key={active}
            card={card}
            onFindEvidence={() => {
              setHighlight(card.concept.evidence);
              setTimeout(() => {
                notesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                notesRef.current?.focus({ preventScroll: true });
              }, 0);
            }}
          />
        ) : (
          <section className="empty">
            <h2 className="empty__title">Not enough here to teach from yet.</h2>
            {result.noCards && (
              <>
                <p>{result.noCards.reason}</p>
                <p>{result.noCards.suggestion}</p>
              </>
            )}
            <button type="button" className="btn btn--ink" onClick={startOver}>
              Paste different notes
            </button>
          </section>
        )}

        <NotesView ref={notesRef} notes={notes} highlight={highlight} />
      </main>
    );
  }

  return (
    <main className="shell compose">
      <section className="compose__notes" aria-labelledby="paste-heading">
        <div className="compose__notes-head">
          <h2 id="paste-heading" className="label">Paste your notes</h2>
          <button type="button" className="link" onClick={() => setNotes(SAMPLE_NOTES)}>
            Try sample notes
          </button>
        </div>
        <label htmlFor="notes" className="sr-only">Your notes</label>
        <textarea
          id="notes"
          className="notes-input"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={MAX_CHARS}
          placeholder="Lecture notes, a textbook section, your own summary. Anything with real explanations in it."
        />
        <p className="compose__count">
          {notes.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </p>
      </section>

      <aside className="compose__side">
        <section aria-labelledby="method-heading">
          <h2 id="method-heading" className="label">What you get, for each concept</h2>
          <ol className="method">
            <li><span className="method__n">1</span><span><b>Concept.</b> What it is, with the line from your notes that proves it.</span></li>
            <li><span className="method__n">2</span><span><b>Mental model.</b> A picture to hold it by, and the wrong picture to watch for.</span></li>
            <li><span className="method__n">3</span><span><b>Use case.</b> A real situation. You answer before you see the answer.</span></li>
          </ol>
        </section>

        {keyField}

        <div className="go">
          <label className="go__count">
            Concepts
            <select className="field" value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn btn--ink go__btn"
            onClick={generate}
            disabled={!key || !notes.trim() || loading}
            aria-busy={loading}
          >
            {loading ? "Reading your notes…" : "Make my cards"}
          </button>
        </div>
        <p className={error ? "go__hint go__hint--error" : "go__hint"} aria-live="polite">
          {error ??
            (loading
              ? "Finding the concepts and checking every quote against your notes. About 10 to 20 seconds."
              : !key
                ? "Add a key above to start."
                : !notes.trim()
                  ? "Paste notes on the left, or try the sample."
                  : "")}
        </p>
      </aside>
    </main>
  );
}
