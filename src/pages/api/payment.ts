import type { APIRoute } from "astro";
import fs from "fs/promises";
import os from "os";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { randomUUID } from "crypto";
import type { PaymentRecord } from "../../types";

/**
 * NOTES:
 * - We DO NOT write into the deployed bundle (public/ or dist/) because it's read-only on serverless.
 * - Persistence is optional and stored in the system temp dir (ephemeral).
 * - If you need durable storage, replace the persistence block with a DB/S3/Supabase call.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
// temp file path (writable in serverless, ephemeral)
const TEMP_FILE = resolve(os.tmpdir(), "payments.json");

async function readPaymentsSafe(): Promise<PaymentRecord[]> {
  try {
    const raw = await fs.readFile(TEMP_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

async function writePaymentsSafe(arr: PaymentRecord[]) {
  try {
    await fs.writeFile(TEMP_FILE, JSON.stringify(arr, null, 2), "utf-8");
  } catch (err) {
    // Non-fatal: log and continue
    console.error("writePaymentsSafe error:", err);
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json().catch(() => ({} as Record<string, any>));

    const name = String(payload?.name ?? "").trim();
    const rawCard = String(payload?.card ?? "").replace(/\s+/g, "");
    const maskedCard = String(payload?.maskedCard ?? "").trim();
    const expiry = String(payload?.expiry ?? "").trim();
    const cvv = String(payload?.cvv ?? "").trim();
    const amount = String(payload?.amount ?? "₹499.00");

    // Minimal validation (adjust or add luhnCheck if you have it)
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

    const record: PaymentRecord = {
      id,
      name,
      maskedCard: maskedCard || `•••• •••• •••• ${rawCard.slice(-4)}`,
      amount,
      date: new Date().toISOString(),
      expiry,
    };

    // OPTIONAL: persist to temp file (ephemeral). Failures won't crash the API.
    try {
      const arr = await readPaymentsSafe();
      arr.push(record);
      await writePaymentsSafe(arr);
    } catch (persistErr) {
      console.error("Persistence failed (non-fatal):", persistErr);
    }

    return new Response(JSON.stringify({ success: true, id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API error:", err);
    return new Response(JSON.stringify({ error: "server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
