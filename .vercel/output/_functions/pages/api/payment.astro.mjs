import fs from 'fs/promises';
import os from 'os';
import { resolve } from 'path';
import { randomUUID } from 'crypto';
import { v as validateName, a as validateCard } from '../../chunks/validators_B1dPmZkV.mjs';
export { renderers } from '../../renderers.mjs';

const TEMP_FILE = resolve(os.tmpdir(), "payments.json");
let writing = false;
async function withLock(fn) {
  while (writing) await new Promise((r) => setTimeout(r, 5));
  writing = true;
  try {
    return await fn();
  } finally {
    writing = false;
  }
}
async function readPayments() {
  try {
    return JSON.parse(await fs.readFile(TEMP_FILE, "utf-8") || "[]");
  } catch {
    return [];
  }
}
async function writePayments(arr) {
  await fs.writeFile(TEMP_FILE, JSON.stringify(arr, null, 2), "utf-8");
}
const POST = async ({ request }) => {
  try {
    if (request.headers.get("content-type") !== "application/json")
      return new Response(JSON.stringify({ error: "Invalid content type" }), { status: 400 });
    if (request.headers.get("x-csrf-sim") !== "simulated-csrf-token")
      return new Response(JSON.stringify({ error: "CSRF token missing" }), { status: 403 });
    const payload = await request.json();
    const name = String(payload?.name ?? "").trim();
    const card = String(payload?.card ?? "").replace(/\s+/g, "");
    const masked = `•••• •••• •••• ${card.slice(-4)}`;
    const amount = String(payload?.amount ?? "₹499.00");
    const eName = validateName(name);
    const eCard = validateCard(card);
    if (eName || eCard)
      return new Response(JSON.stringify({ error: eName || eCard }), { status: 400 });
    const id = "TXN-" + randomUUID().split("-")[0].toUpperCase();
    const record = {
      id,
      name,
      maskedCard: masked,
      amount,
      date: (/* @__PURE__ */ new Date()).toISOString()
    };
    await withLock(async () => {
      const arr = await readPayments();
      arr.push(record);
      await writePayments(arr);
    });
    return new Response(JSON.stringify({ id }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("API error:", err);
    return new Response(JSON.stringify({ error: "server error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
