// src/pages/api/__tests__/payment.test.ts
import { POST } from '../payment';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock fs/promises so tests do not write to disk
vi.mock('fs/promises', () => {
  return {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  };
});
import * as fs from 'fs/promises';

vi.mock('os', () => ({ tmpdir: () => '/tmp' }));
vi.mock('path', () => ({ resolve: (...parts: string[]) => parts.join('/') }));

describe('POST /api/payment handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when content-type is not application/json', async () => {
    const req = new Request('http://localhost/api/payment', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
        'x-csrf-sim': 'simulated-csrf-token',
      },
      body: 'hello',
    });

    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
    const body = JSON.parse(await res.text());
    expect(body.error).toMatch(/invalid content type/i);
  });

  it('returns 403 when csrf header missing', async () => {
    const req = new Request('http://localhost/api/payment', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ name: 'A', card: '4242424242424242' }),
    });

    const res = await POST({ request: req } as any);
    expect(res.status).toBe(403);
    const body = JSON.parse(await res.text());
    expect(body.error).toMatch(/csrf token missing/i);
  });

  it('returns 400 when server-side validation fails (name or card invalid)', async () => {
    const req = new Request('http://localhost/api/payment', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-csrf-sim': 'simulated-csrf-token',
      },
      body: JSON.stringify({ name: '', card: '1234' }), // invalid name + card
    });

    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
    const body = JSON.parse(await res.text());
    // either name error or card error
    expect(body.error).toBeTruthy();
  });

  it('creates a payment record, writes to file and returns id on success', async () => {
    // mock readFile to return empty array initially, writeFile to resolve
    (fs.readFile as any).mockResolvedValueOnce('[]');
    (fs.writeFile as any).mockResolvedValueOnce(undefined);

    const payload = {
      name: 'Vedika Jamdar',
      card: '4242424242424242',
      amount: '₹499.00',
    };

    const req = new Request('http://localhost/api/payment', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-csrf-sim': 'simulated-csrf-token',
      },
      body: JSON.stringify(payload),
    });

    const res = await POST({ request: req } as any);
    expect(res.status).toBe(201);

    const data = JSON.parse(await res.text());
    expect(data.id).toBeTruthy();
    // ensure we attempted to read and write payments
    expect(fs.readFile).toHaveBeenCalled();
    expect(fs.writeFile).toHaveBeenCalled();
  });
});
