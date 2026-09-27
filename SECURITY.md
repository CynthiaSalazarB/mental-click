# Security: how your API key is handled

This tool uses your own Gemini or OpenRouter key. Here is exactly what happens to it, and
what you can do so that you don't have to trust me at all.

## The short version

- Your key is stored **only in your browser**: for this tab only by default (`sessionStorage`),
  or on this device if you tick "Remember" (`localStorage`). "Forget my key" deletes it.
- When you make cards, the key is sent over HTTPS, **in a request header, never in the URL**, to
  this app's server route, which forwards one request to Gemini or OpenRouter and returns the
  answer. The key is used for that one request and then gone.
- There is **no database, no accounts, and no logging** of keys, headers or notes.

## Why the key passes through the server at all

Google's Gemini endpoints block direct calls from browsers (CORS), so a server route has to make
the call. The route (`app/api/generate/route.ts`) is a stateless pass-through: it reads the key
from the `x-user-key` header, calls the provider, and returns only the parsed cards. It never
forwards the provider's raw error body, and it never writes anything to disk or logs.

## What protects the key on the page

- **Strict Content Security Policy** (`proxy.ts`): a fresh nonce per request, so only this app's
  own scripts run. No third-party scripts at all: no analytics, no ads, no external fonts (fonts
  are self-hosted at build time).
- **Model output and your notes are rendered as plain text, never as HTML.** Pasted notes could
  contain hidden instructions (prompt injection) that make the model output a script; rendering
  as text makes that harmless.
- `frame-ancestors 'none'` (no embedding in other sites), `Referrer-Policy: no-referrer`,
  `X-Content-Type-Options: nosniff`, HSTS.
- Minimal dependencies (Next.js, React, Tailwind), with the lockfile committed.

## What no website can protect against

Browser extensions and malware on your own device can read anything on any page. If you don't
trust your device, don't paste a key into any website.

## The protection that needs no trust in me

Make a **separate key just for this tool**:

- **Gemini:** a free key from [Google AI Studio](https://aistudio.google.com/apikey) on an account
  without billing. If it leaked, the worst case is someone using up your free daily requests. It
  can't cost you money.
- **OpenRouter:** create a key with a small **credit limit** (for example $2). The worst case is
  that number.

Delete the key whenever you're done. That works no matter what this code does.

## Reporting a problem

If you find a security issue, please open a private security advisory on the GitHub repository
instead of a public issue.
