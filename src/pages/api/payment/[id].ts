import type { APIRoute } from "astro";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import type { PaymentRecord } from "../../../types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, "../../../../public/payments.json");

async function readPayments(): Promise<PaymentRecord[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

export const GET: APIRoute = async ({ params }) => {
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
