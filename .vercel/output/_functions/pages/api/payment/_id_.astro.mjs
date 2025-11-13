import fs from 'fs/promises';
import os from 'os';
import { resolve } from 'path';
export { renderers } from '../../../renderers.mjs';

const TEMP_FILE = resolve(os.tmpdir(), "payments.json");
async function readPayments() {
  try {
    return JSON.parse(await fs.readFile(TEMP_FILE, "utf-8") || "[]");
  } catch {
    return [];
  }
}
const GET = async ({ params }) => {
  const id = String(params?.id ?? "").trim();
  if (!id)
    return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
  const payments = await readPayments();
  const found = payments.find((p) => p.id === id);
  if (!found)
    return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  return new Response(JSON.stringify(found), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
