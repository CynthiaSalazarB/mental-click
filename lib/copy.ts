export const SAMPLE_NOTES = `## Git basics

A commit is a snapshot of every tracked file in the project at one moment, saved with a message that explains the change. Commits are permanent history: you can always go back to an earlier commit.

A branch is a movable pointer to a commit. Creating a branch does not copy any files, so branches are cheap, and each new commit moves the current branch forward.

Merging combines the history of two branches. If both branches changed the same lines of the same file, Git cannot decide which version to keep and stops with a merge conflict, which a person has to resolve by editing the file.

The staging area holds the changes that will go into the next commit. git add moves changes into the staging area, and only staged changes are saved when you run git commit.
`;

export const ERROR_COPY: Record<string, string> = {
  unknown_key:
    "That doesn't look like a Gemini or OpenRouter key. Gemini keys start with AIza or AQ., OpenRouter keys with sk-or-.",
  key_rejected: "The provider turned this key down. Check it was copied in full, or make a new one.",
  no_credit: "This OpenRouter account is out of credit. Top it up, or use a free Gemini key.",
  rate_limited:
    "This key has hit its limit for now. Free Gemini keys allow a small number of requests a day. Try again later, or use another key.",
  provider_down: "The model is busy right now. Give it a minute and try again.",
  provider_unreachable: "The model didn't answer in time. Give it a minute and try again.",
  bad_output: "The model's answer came back scrambled. Try again, it usually works on the second go.",
  notes_too_long: "That's over 40,000 characters. Paste one lecture or chapter at a time.",
  empty_notes: "Paste some notes first.",
  bad_request: "Something went wrong with that request. Reload the page and try again.",
  network: "Couldn't reach the server. Check your connection and try again.",
};
