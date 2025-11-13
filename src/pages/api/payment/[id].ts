import type { APIRoute } from "astro";
import fs from "fs/promises";
import os from "os";
import { resolve } from "path";
import type { PaymentRecord } from "../../../types";

const TEMP_FILE = resolve(os.tmpdir(), "payments.json");

async function readPayments(): Promise<PaymentRecord[]> {
  try { return JSON.parse(await fs.readFile(TEMP_FILE, "utf-8") || "[]"); }
  catch { return []; }
}

export const GET: APIRoute = async ({ params }) => {
  const id = String(params?.id ?? "").trim();
  if (!id)
    return new Response(JSON.stringify({ error: "id required" }), { status: 400 });

  const payments = await readPayments();
  const found = payments.find((p) => p.id === id);
  if (!found)
    return new Response(JSON.stringify({ error: "not found" }), { status: 404 });

  return new Response(JSON.stringify(found), { status: 200 });
};
