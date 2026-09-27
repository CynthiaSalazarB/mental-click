// The key lives only in this browser. Default: sessionStorage (gone when the
// tab closes). "Remember on this device" moves it to localStorage.
const STORAGE_KEY = "study-tool:api-key";

export type StoredKey = { key: string; remember: boolean };

export function loadKey(): StoredKey | null {
  try {
    const remembered = localStorage.getItem(STORAGE_KEY);
    if (remembered) return { key: remembered, remember: true };
    const session = sessionStorage.getItem(STORAGE_KEY);
    if (session) return { key: session, remember: false };
  } catch {
    // storage blocked (private mode, settings): the key just is not kept
  }
  return null;
}

export function saveKey(key: string, remember: boolean) {
  forgetKey();
  try {
    (remember ? localStorage : sessionStorage).setItem(STORAGE_KEY, key);
  } catch {
    // storage blocked: nothing is kept
  }
  notifyKeyChange();
}

export function forgetKey() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // nothing stored
  }
  notifyKeyChange();
}

// useSyncExternalStore plumbing: storage is an external store, so React reads
// it through a snapshot instead of copying it into state inside an effect.
const CHANGE_EVENT = "study-tool:key-change";

export function subscribeKey(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** A primitive snapshot ("remember|key") so React can compare it cheaply. */
export function keySnapshot(): string {
  const stored = loadKey();
  return stored ? `${stored.remember ? 1 : 0}|${stored.key}` : "";
}

export function notifyKeyChange() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
