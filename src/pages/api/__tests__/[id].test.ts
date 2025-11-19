// src/pages/api/__tests__/[id].test.ts
import { vi, describe, it, expect, beforeEach } from 'vitest';

// 🟢 CORRECT MOCK — Must mock default export
vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}));

// After mock, import the route
import { GET } from '../payment/[id]';
import fs from 'fs/promises';

describe('GET /api/payment/:id handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when id missing', async () => {
    const res = await GET({ params: {} } as any);
    expect(res.status).toBe(400);
  });

  it('returns 404 when id not found', async () => {
    fs.readFile.mockResolvedValueOnce(JSON.stringify([
      { id: 'TXN-AAA' }
    ]));

    const res = await GET({ params: { id: 'NOPE' } } as any);
    expect(res.status).toBe(404);
  });

  it('returns 200 and record when found', async () => {
    const record = {
      id: 'TXN-FOUND',
      name: 'Vedika',
      maskedCard: '•••• 4242',
      amount: '₹499.00',
      date: new Date().toISOString()
    };

    fs.readFile.mockResolvedValueOnce(JSON.stringify([record]));

    const res = await GET({ params: { id: 'TXN-FOUND' } } as any);
    expect(res.status).toBe(200);

    const data = JSON.parse(await res.text());
    expect(data.id).toBe('TXN-FOUND');
    expect(data.name).toBe('Vedika');
  });
});
