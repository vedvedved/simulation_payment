import fs from 'fs/promises';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { randomUUID } from 'crypto';
export { renderers } from '../../renderers.mjs';

dirname(fileURLToPath(import.meta.url));
const TEMP_FILE = resolve(os.tmpdir(), "payments.json");
async function readPaymentsSafe() {
  try {
    const raw = await fs.readFile(TEMP_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}
async function writePaymentsSafe(arr) {
  try {
    await fs.writeFile(TEMP_FILE, JSON.stringify(arr, null, 2), "utf-8");
  } catch (err) {
    console.error("writePaymentsSafe error:", err);
  }
}
const POST = async ({ request }) => {
  try {
    const payload = await request.json().catch(() => ({}));
    const name = String(payload?.name ?? "").trim();
    const rawCard = String(payload?.card ?? "").replace(/\s+/g, "");
    const maskedCard = String(payload?.maskedCard ?? "").trim();
    const expiry = String(payload?.expiry ?? "").trim();
    const cvv = String(payload?.cvv ?? "").trim();
    const amount = String(payload?.amount ?? "₹499.00");
    if (!name) {
      return new Response(JSON.stringify({ error: "name required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (!/^\d{13,19}$/.test(rawCard)) {
      return new Response(JSON.stringify({ error: "card invalid" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      return new Response(JSON.stringify({ error: "cvv invalid" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const id = "TXN-" + randomUUID().split("-")[0].toUpperCase();
    const record = {
      id,
      name,
      maskedCard: maskedCard || `•••• •••• •••• ${rawCard.slice(-4)}`,
      amount,
      date: (/* @__PURE__ */ new Date()).toISOString(),
      expiry
    };
    try {
      const arr = await readPaymentsSafe();
      arr.push(record);
      await writePaymentsSafe(arr);
    } catch (persistErr) {
      console.error("Persistence failed (non-fatal):", persistErr);
    }
    return new Response(JSON.stringify({ success: true, id }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("API error:", err);
    return new Response(JSON.stringify({ error: "server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
