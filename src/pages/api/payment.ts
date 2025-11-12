import type { APIRoute } from "astro";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { randomUUID } from "crypto";
import type { PaymentRecord } from "../../types";
import { luhnCheck } from "../../lib/validators";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, "../../../public/payments.json");

async function readPayments(): Promise<PaymentRecord[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

async function writePayments(arr: PaymentRecord[]) {
  await fs.mkdir(resolve(__dirname, "../../../public"), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(arr, null, 2), "utf-8");
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();

    const name = String(payload?.name ?? "").trim();
    const rawCard = String(payload?.card ?? "").replace(/\s+/g, "");
    const maskedCard = String(payload?.maskedCard ?? "").trim();
    const expiry = String(payload?.expiry ?? "").trim();
    const cvv = String(payload?.cvv ?? "").trim();
    const amount = String(payload?.amount ?? "₹499.00");

    if (!name) return new Response(JSON.stringify({ error: "name required" }), { status: 400 });
    if (!/^\d{13,19}$/.test(rawCard)) return new Response(JSON.stringify({ error: "card invalid" }), { status: 400 });
    if (!luhnCheck(rawCard)) return new Response(JSON.stringify({ error: "card Luhn failed" }), { status: 400 });

    const expDigits = expiry.replace(/\D/g, "");
    if (!/^\d{4}$/.test(expDigits)) return new Response(JSON.stringify({ error: "expiry invalid" }), { status: 400 });

    if (!/^\d{3,4}$/.test(cvv)) return new Response(JSON.stringify({ error: "cvv invalid" }), { status: 400 });

    const id = "TXN-" + randomUUID().split("-")[0].toUpperCase();

    const record: PaymentRecord = {
      id,
      name,
      maskedCard: maskedCard || `•••• •••• •••• ${rawCard.slice(-4)}`,
      amount,
      date: new Date().toISOString(),
      expiry,
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
