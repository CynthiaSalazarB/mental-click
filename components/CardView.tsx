"use client";

import { useState } from "react";
import type { CheckedCard } from "@/lib/cards";

type Props = {
  card: CheckedCard;
  onFindEvidence: () => void;
};

// One card, three panels, always in the method's order. Keyed by card in the
// parent, so every reveal resets when the student moves to another card.
export function CardView({ card, onFindEvidence }: Props) {
  return (
    <div className="panels">
      <ConceptPanel card={card} onFindEvidence={onFindEvidence} />
      <ModelPanel card={card} />
      <UseCasePanel card={card} />
    </div>
  );
}

function PanelHead({ n, name }: { n: number; name: string }) {
  return (
    <header className="panel__head">
      <span className="panel__n" aria-hidden="true">{n}</span>
      <h3 className="panel__name">{name}</h3>
    </header>
  );
}

function ConceptPanel({ card, onFindEvidence }: Props) {
  const { title, explanation, evidence } = card.concept;
  return (
    <article className="panel" aria-label="Step 1, concept">
      <PanelHead n={1} name="Concept" />
      <h4 className="panel__title">{title}</h4>
      <p className="panel__body">{explanation}</p>
      <figure className="evidence">
        <blockquote>{evidence.replace(/^"|"$/g, "")}</blockquote>
        <figcaption>
          {card.evidenceVerified ? (
            <span className="evidence__ok">From your notes, checked word for word.</span>
          ) : (
            <span className="evidence__warn">Couldn&apos;t match this quote exactly. Double-check it.</span>
          )}
          <button type="button" className="link" onClick={onFindEvidence}>
            Find it in my notes
          </button>
        </figcaption>
      </figure>
    </article>
  );
}

function ModelPanel({ card }: { card: CheckedCard }) {
  const { analogy, misconception, correction } = card.mental_model;
  const [verdict, setVerdict] = useState<"agree" | "doubt" | null>(null);
  return (
    <article className="panel" aria-label="Step 2, mental model">
      <PanelHead n={2} name="Mental model" />
      <p className="panel__body panel__analogy">{analogy}</p>
      <div className="trap">
        <p className="label">A classmate says</p>
        <p className="pencil">&ldquo;{misconception.replace(/^"|"$/g, "")}&rdquo;</p>
        {verdict === null ? (
          <div className="trap__choices" role="group" aria-label="Is your classmate right?">
            <button type="button" className="btn btn--line" onClick={() => setVerdict("agree")}>
              Sounds right
            </button>
            <button type="button" className="btn btn--line" onClick={() => setVerdict("doubt")}>
              Something&apos;s off
            </button>
          </div>
        ) : (
          <div className="reveal" aria-live="polite">
            <p className="reveal__verdict">
              {verdict === "doubt" ? "Good eye, it's a trap." : "That's the trap."}
            </p>
            <p className="panel__body">{correction}</p>
          </div>
        )}
      </div>
    </article>
  );
}

function UseCasePanel({ card }: { card: CheckedCard }) {
  const { scenario, challenge, answer } = card.use_case;
  const [guess, setGuess] = useState("");
  const [shown, setShown] = useState(false);
  return (
    <article className="panel" aria-label="Step 3, use case">
      <PanelHead n={3} name="Use case" />
      <p className="panel__body">{scenario}</p>
      <p className="challenge">{challenge}</p>
      <label htmlFor="guess" className="label">Your answer first</label>
      <textarea
        id="guess"
        className="field pencil guess"
        rows={3}
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        readOnly={shown}
        placeholder="Even a rough guess helps it stick."
      />
      {shown ? (
        <div className="reveal" aria-live="polite">
          <p className="label">Answer</p>
          <p className="panel__body">{answer}</p>
        </div>
      ) : (
        <button type="button" className="btn btn--line" onClick={() => setShown(true)}>
          Show the answer
        </button>
      )}
    </article>
  );
}
