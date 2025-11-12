import type { APIRoute } from "astro";
import fs from "fs/promises";
import os from "os";
import { resolve } from "path";
import type { PaymentRecord } from "../../../types";

/**
 * This handler reads payments from a TEMP file (os.tmpdir()) instead of public/dist,
 * because deployed serverless runtimes cannot write into the bundle.
 *
 * Note: TEMP storage is ephemeral. For durable persistence use a DB or external storage.
 */

const TEMP_FILE = resolve(os.tmpdir(), "payments.json");

async function readPaymentsSafe(): Promise<PaymentRecord[]> {
  try {
    const raw = await fs.readFile(TEMP_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = String(params?.id ?? "").trim();
    if (!id) {
      return new Response(JSON.stringify({ error: "id required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const arr = await readPaymentsSafe();
    const found = arr.find((r) => r.id === id);

    if (!found) {
      return new Response(JSON.stringify({ error: "not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(found), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API GET error:", err);
    return new Response(JSON.stringify({ error: "server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
