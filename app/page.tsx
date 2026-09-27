import { connection } from "next/server";
import { StudyApp } from "@/components/StudyApp";

export default async function Page() {
  // Render per request so the CSP nonce from proxy.ts reaches every script.
  await connection();
  return (
    <>
      <header className="masthead">
        <h1 className="masthead__title">Mental Click</h1>
        <p className="masthead__method">
          Concept<span className="masthead__sep">,</span> mental model<span className="masthead__sep">,</span> use case
        </p>
        <p className="masthead__sub">
          The three steps I use to actually understand something. Paste your notes and walk each
          concept through them until it clicks.
        </p>
        <p className="masthead__by">
          by{" "}
          <a href="https://www.instagram.com/cynthias.dev/" target="_blank" rel="noopener noreferrer">
            @cynthias.dev
          </a>
        </p>
      </header>
      <StudyApp />
      <footer className="colophon">
        <p>Your key and notes are never stored. No accounts, no tracking.</p>
      </footer>
    </>
  );
}
