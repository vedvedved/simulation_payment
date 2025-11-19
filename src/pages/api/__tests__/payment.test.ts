// src/pages/api/__tests__/payment.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { POST } from "../payment";
import fs from "fs/promises";
import os from "os";
import { resolve } from "path";

const TEMP_FILE = resolve(os.tmpdir(), "payments.json");

async function readTempFile(): Promise<any[]> {
  try {
    const raw = await fs.readFile(TEMP_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

async function removeTempFile() {
  try {
    await fs.unlink(TEMP_FILE);
  } catch {
    /* ignore */
  }
}

describe("POST /api/payment", () => {
  beforeEach(async () => {
    await removeTempFile();
  });

  afterEach(async () => {
    await removeTempFile();
  });

  it("returns 400 when content-type is not application/json", async () => {
    const req = new Request("http://localhost/api/payment", {
      method: "POST",
      headers: { "content-type": "text/plain", "x-csrf-sim": "simulated-csrf-token" },
      body: "hi",
    });

    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
    const json = JSON.parse(await res.text());
    expect(json.error).toMatch(/invalid content type/i);
  });

  it("returns 403 when CSRF header missing", async () => {
    const req = new Request("http://localhost/api/payment", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "A", card: "4242424242424242" }),
    });

    const res = await POST({ request: req } as any);
    expect(res.status).toBe(403);
    const json = JSON.parse(await res.text());
    expect(json.error).toMatch(/csrf token missing/i);
  });

  it("returns 400 when server-side validation fails (name or card invalid)", async () => {
    const req = new Request("http://localhost/api/payment", {
      method: "POST",
      headers: { "content-type": "application/json", "x-csrf-sim": "simulated-csrf-token" },
      body: JSON.stringify({ name: "", card: "1234" }), // invalid
    });

    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
    const json = JSON.parse(await res.text());
    expect(json.error).toBeTruthy();
  });

  it("creates a payment record, writes to temp file and returns id on success", async () => {
    const payload = {
      name: "Integration Tester",
      card: "4242 4242 4242 4242",
      amount: "₹499.00",
    };

    const req = new Request("http://localhost/api/payment", {
      method: "POST",
      headers: { "content-type": "application/json", "x-csrf-sim": "simulated-csrf-token" },
      body: JSON.stringify(payload),
    });

    const res = await POST({ request: req } as any);
    // successful creation
    expect(res.status).toBe(201);

    const body = JSON.parse(await res.text());
    expect(body.id).toBeTruthy();
    expect(typeof body.id).toBe("string");

    // ensure file exists and contains the record
    const arr = await readTempFile();
    expect(Array.isArray(arr)).toBe(true);
    const found = arr.find((r: any) => r.id === body.id);
    expect(found).toBeTruthy();
    expect(found.name).toBe("Integration Tester");
    // maskedCard pattern ends with last 4
    expect(found.maskedCard).toMatch(/4242$/);
  });
});
