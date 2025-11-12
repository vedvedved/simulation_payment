import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { randomUUID } from 'crypto';
export { renderers } from '../../renderers.mjs';

const __dirname$1 = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname$1, "../../../public/payments.json");
async function readPayments() {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}
async function writePayments(arr) {
  await fs.mkdir(resolve(__dirname$1, "../../../public"), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(arr, null, 2), "utf-8");
}
const POST = async ({ request }) => {
  try {
    const payload = await request.json();
    const name = String(payload?.name ?? "").trim();
    const rawCard = String(payload?.card ?? "").replace(/\s+/g, "");
    const maskedCard = String(payload?.maskedCard ?? "").trim();
    const expiry = String(payload?.expiry ?? "").trim();
    const cvv = String(payload?.cvv ?? "").trim();
    const amount = String(payload?.amount ?? "₹499.00");
    const id = "TXN-" + randomUUID().split("-")[0].toUpperCase();
    const record = {
      id,
      name,
      maskedCard: maskedCard || `•••• •••• •••• ${rawCard.slice(-4)}`,
      amount,
      date: (/* @__PURE__ */ new Date()).toISOString(),
      expiry
    };
    const arr = await readPayments();
    arr.push(record);
    await writePayments(arr);
    return new Response(JSON.stringify({ success: true, id }), { status: 201 });
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
