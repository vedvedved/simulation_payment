import fs from 'fs/promises';
import os from 'os';
import { resolve } from 'path';
export { renderers } from '../../../renderers.mjs';

const TEMP_FILE = resolve(os.tmpdir(), "payments.json");
async function readPaymentsSafe() {
  try {
    const raw = await fs.readFile(TEMP_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}
const GET = async ({ params }) => {
  try {
    const id = String(params?.id ?? "").trim();
    if (!id) {
      return new Response(JSON.stringify({ error: "id required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const arr = await readPaymentsSafe();
    const found = arr.find((r) => r.id === id);
    if (!found) {
      return new Response(JSON.stringify({ error: "not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(found), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("API GET error:", err);
    return new Response(JSON.stringify({ error: "server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
