// src/services/__tests__/paymentServices.test.ts
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { paymentService } from '../paymentService';

describe('paymentServices client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('submit posts correct payload and returns id on success', async () => {
    const fakeResponse = { id: 'TXN-123' };
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeResponse),
      })
    ));

    const out = await paymentService.submit({ name: ' Vedika ', card: '4242 4242 4242 4242', expiry: '', cvv: '' } as any, 'simulated-csrf-token');

    expect(out).toEqual(fakeResponse);
    expect((global.fetch as any)).toHaveBeenCalledTimes(1);
    const [url, opts] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('/api/payment');
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body);
    expect(body.name).toBe('Vedika'); // trimmed
    expect(body.card).toBe('4242424242424242'); // spaces removed
    expect(opts.headers['x-csrf-sim']).toBe('simulated-csrf-token');
  });

  it('submit throws when server returns non-ok', async () => {
    const server = { error: 'Invalid card' };
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(server),
      })
    ));

    await expect(paymentService.submit({ name: 'A', card: '1234', expiry: '', cvv: '' } as any, 'simulated-csrf-token')).rejects.toThrow();
  });

  it('GET fetches a payment record by id on success', async () => {
    const record = { id: 'TXN-1', name: 'Vedika', maskedCard: '•••• 4242', amount: '₹499.00', date: new Date().toISOString() };
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(record),
      })
    ));

    const out = await paymentService.GET('TXN-1');
    expect(out).toEqual(record);
    expect((global.fetch as any)).toHaveBeenCalledWith('/api/payment/TXN-1');
  });

  it('GET throws when not found', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ));

    await expect(paymentService.GET('NOPE')).rejects.toThrow();
  });
});
