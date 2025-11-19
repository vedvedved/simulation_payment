// src/pages/api/__tests__/[id].test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { GET } from "../payment/[id]";
import fs from "fs/promises";
import os from "os";
import { resolve } from "path";

const TEMP_FILE = resolve(os.tmpdir(), "payments.json");

async function writeTempPayments(arr: any[]) {
  await fs.writeFile(TEMP_FILE, JSON.stringify(arr, null, 2), "utf-8");
}

async function removeTempFile() {
  try {
    await fs.unlink(TEMP_FILE);
  } catch {
    /* ignore */
  }
}

describe("GET /api/payment/:id", () => {
  beforeEach(async () => {
    await removeTempFile();
  });

  afterEach(async () => {
    await removeTempFile();
  });

  it("returns 400 when id param is missing/empty", async () => {
    const res = await GET({ params: {} } as any);
    expect(res.status).toBe(400);
    const json = JSON.parse(await res.text());
    expect(json.error).toMatch(/id required/i);
  });

  it("returns 404 when id not found", async () => {
    // write a file without the searched id
    await writeTempPayments([
      { id: "TXN-ALPHA", name: "A", maskedCard: "•••• 1111", amount: "₹499.00", date: new Date().toISOString() },
    ]);

    const res = await GET({ params: { id: "TXN-NOTFOUND" } } as any);
    expect(res.status).toBe(404);
    const json = JSON.parse(await res.text());
    expect(json.error).toMatch(/not found/i);
  });

  it("returns 200 and the record when found", async () => {
    const record = {
      id: "TXN-FOUND",
      name: "Vedika",
      maskedCard: "•••• 4242",
      amount: "₹499.00",
      date: new Date().toISOString(),
    };

    await writeTempPayments([record]);

    const res = await GET({ params: { id: "TXN-FOUND" } } as any);
    expect(res.status).toBe(200);
    const body = JSON.parse(await res.text());
    expect(body.id).toBe("TXN-FOUND");
    expect(body.name).toBe("Vedika");
  });
});
