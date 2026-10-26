// Create (or reset) the single admin account: `npm run admin:create`.
// Asks for email + password in the terminal; the password is never stored in the repo.
import { createInterface } from "node:readline";
import { Writable } from "node:stream";
import { stdin, stdout } from "node:process";
import { getAuth } from "../src/lib/auth.ts";

// Terminal output that can be muted while a password is typed.
let muted = false;
const output = new Writable({
  write(chunk, _enc, done) {
    if (!muted) stdout.write(chunk);
    done();
  },
});
const rl = createInterface({ input: stdin, output, terminal: Boolean(stdin.isTTY) });
const lines = rl[Symbol.asyncIterator]();

async function ask(question: string, hide = false) {
  stdout.write(question);
  muted = hide;
  const { value } = await lines.next();
  muted = false;
  if (hide && stdin.isTTY) stdout.write("\n");
  return (value ?? "") as string;
}

const email = (await ask("Admin email (a real inbox — reset links go here): ")).trim().toLowerCase();
if (!/^\S+@\S+\.\S+$/.test(email)) {
  console.error("✗ That doesn't look like an email.");
  process.exit(1);
}
const password = await ask("Password (at least 10 characters): ", true);
const again = await ask("Same password again: ", true);
rl.close();
if (password.length < 10) {
  console.error("\n✗ Use at least 10 characters.");
  process.exit(1);
}
if (password !== again) {
  console.error("\n✗ The two passwords don't match.");
  process.exit(1);
}

const ctx = await getAuth().$context;
const hash = await ctx.password.hash(password);
const existing = await ctx.internalAdapter.findUserByEmail(email, { includeAccounts: true });

if (existing) {
  // Same owner, new password.
  await ctx.internalAdapter.updatePassword(existing.user.id, hash);
  console.log(`\n✓ Password updated for ${email}.`);
} else {
  const others = await ctx.adapter.count({ model: "user" });
  if (others > 0) {
    console.error("\n✗ An admin account with a different email already exists (single-owner site).");
    process.exit(1);
  }
  const created = await ctx.internalAdapter.createUser({ email, name: "Yurix", emailVerified: true }, { method: "admin" });
  await ctx.internalAdapter.linkAccount({ userId: created.id, providerId: "credential", accountId: created.id, password: hash });
  console.log(`\n✓ Admin account created for ${email}. Sign in at /admin/login.`);
}
process.exit(0);
