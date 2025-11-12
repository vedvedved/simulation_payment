import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
export { renderers } from '../../../renderers.mjs';

const __dirname$1 = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname$1, "../../../../public/payments.json");
async function readPayments() {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}
const GET = async ({ params }) => {
  try {
    const id = String(params.id ?? "");
    if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
    const arr = await readPayments();
    const found = arr.find((r) => r.id === id);
    if (!found) return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
    return new Response(JSON.stringify(found), { status: 200 });
  } catch (err) {
    console.error("API GET error:", err);
    return new Response(JSON.stringify({ error: "server error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
