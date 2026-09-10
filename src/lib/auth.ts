import { ADMIN_ENABLED, ADMIN_HASH, ADMIN_SALT } from "./admin.env";

const LOCK_KEY = "appstore-admin-lock";
const SESSION_KEY = "appstore-admin-session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;

interface LockState {
  fails: number;
  first: number;
  until: number;
}

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage unavailable — session-only security still applies
  }
}

function safeRemove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function isAdminEnabled(): boolean {
  return ADMIN_ENABLED;
}

function getLock(): LockState {
  const raw = safeGet(LOCK_KEY);
  if (!raw) return { fails: 0, first: 0, until: 0 };
  try {
    return JSON.parse(raw) as LockState;
  } catch {
    return { fails: 0, first: 0, until: 0 };
  }
}

function setLock(state: LockState): void {
  safeSet(LOCK_KEY, JSON.stringify(state));
}

export function getLockStatus() {
  const { fails, first, until } = getLock();
  const now = Date.now();
  if (until > now) {
    return { locked: true, remainingMs: until - now, attemptsLeft: 0 };
  }
  if (first > 0 && now - first > WINDOW_MS) {
    return { locked: false, remainingMs: 0, attemptsLeft: MAX_ATTEMPTS };
  }
  return {
    locked: false,
    remainingMs: 0,
    attemptsLeft: Math.max(0, MAX_ATTEMPTS - fails)
  };
}

function recordAttempt(success: boolean): void {
  const lock = getLock();
  const now = Date.now();
  if (lock.first === 0 || now - lock.first > WINDOW_MS) {
    lock.fails = 0;
    lock.first = now;
    lock.until = 0;
  }
  if (success) {
    safeRemove(LOCK_KEY);
    return;
  }
  lock.fails += 1;
  if (lock.fails >= MAX_ATTEMPTS) {
    lock.until = now + LOCK_MS;
  }
  setLock(lock);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

async function derive(password: string, saltHex: string, iterations: number): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const material = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: hexToBytes(saltHex) as unknown as BufferSource,
      iterations,
      hash: "SHA-256"
    },
    material as unknown as CryptoKey,
    256
  );
  return new Uint8Array(bits);
}

export async function verifyPassword(password: string) {
  if (!ADMIN_ENABLED) {
    return { ok: false as const, reason: "disabled" as const, remainingMs: 0 };
  }
  const status = getLockStatus();
  if (status.locked) {
    return { ok: false as const, reason: "locked" as const, remainingMs: status.remainingMs };
  }
  const derived = await derive(password, ADMIN_SALT, 150000);
  const expected = hexToBytes(ADMIN_HASH);
  const ok = timingSafeEqual(derived, expected);
  recordAttempt(ok);
  if (ok) {
    const token = crypto.randomUUID();
    safeSet(SESSION_KEY, JSON.stringify({ token, exp: Date.now() + SESSION_TTL_MS }));
    return { ok: true as const, reason: "ok" as const, remainingMs: 0 };
  }
  const after = getLockStatus();
  return {
    ok: false as const,
    reason: (after.locked ? "locked" : "invalid") as "locked" | "invalid",
    remainingMs: after.remainingMs
  };
}

export function hasValidSession(): boolean {
  const raw = safeGet(SESSION_KEY);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw) as { token: string; exp: number };
    return !!parsed.token && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

export function startSession(): void {
  const token = crypto.randomUUID();
  safeSet(SESSION_KEY, JSON.stringify({ token, exp: Date.now() + SESSION_TTL_MS }));
}

export function endSession(): void {
  safeRemove(SESSION_KEY);
  safeRemove(LOCK_KEY);
}