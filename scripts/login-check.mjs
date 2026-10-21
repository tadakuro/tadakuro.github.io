import { pbkdf2Sync, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const password = process.env.ADMIN_PASSWORD;
if (!password) {
  console.error("Usage: ADMIN_PASSWORD=<key> node scripts/login-check.mjs [src|live]");
  process.exit(1);
}
const mode = process.argv[2] || "src";

let creds = null;
if (mode === "live") {
  const site = process.env.SITE_URL || "https://tadakuro.github.io";
  const base = `${site}/admin/`;
  const html = await (await fetch(base)).text();
  for (const m of html.matchAll(/\/_next\/static\/[^"]+\.js/g)) {
    const js = await (await fetch(new URL(m[0], base))).text();
    if (/appstore-admin/.test(js)) {
      const tokens = [...js.matchAll(/[0-9a-f]{32,64}/g)]
        .map((t) => t[0])
        .filter((t) => t.length === 32 || t.length === 64);
      creds = {
        hash: tokens.find((t) => t.length === 64) ?? null,
        salt: tokens.find((t) => t.length === 32) ?? null,
      };
      console.error(`[login-api] live bundle: ${m[0]}`);
      break;
    }
  }
  if (!creds) {
    console.log(JSON.stringify({ ok: false, reason: "disabled" }));
    process.exit(0);
  }
} else {
  const env = readFileSync("src/lib/admin.env.ts", "utf8");
  creds = {
    hash: env.match(/ADMIN_HASH = "([0-9a-f]{64})"/)?.[1] ?? null,
    salt: env.match(/ADMIN_SALT = "([0-9a-f]{32})"/)?.[1] ?? null,
  };
}

if (!creds.hash || !creds.salt) {
  console.log(JSON.stringify({ ok: false, reason: "disabled" }));
  process.exit(0);
}

const derived = pbkdf2Sync(password, Buffer.from(creds.salt, "hex"), 150000, 32, "sha256");
const ok = timingSafeEqual(derived, Buffer.from(creds.hash, "hex"));
console.log(JSON.stringify({ ok, reason: ok ? "ok" : "invalid" }));
process.exit(ok ? 0 : 1);
