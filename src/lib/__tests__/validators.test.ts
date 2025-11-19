// src/lib/__tests__/validators.test.ts
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import {
  luhnCheck,
  formatCardInput,
  formatExpiryInput,
  maskCardDisplay,
  validateName,
  validateCard,
  validateExpiry,
  validateCvv,
} from '../validators';

describe('validators & formatters', () => {
  it('luhnCheck recognizes valid and invalid numbers', () => {
    expect(luhnCheck('4242 4242 4242 4242')).toBe(true);
    expect(luhnCheck('4111 1111 1111 1111')).toBe(true);
    expect(luhnCheck('1234 5678 9012 3456')).toBe(false);
  });

  it('formatCardInput groups digits in 4s and trims', () => {
    expect(formatCardInput('4242424242424242')).toBe('4242 4242 4242 4242');
    expect(formatCardInput('4242-4242-4242-4242')).toBe('4242 4242 4242 4242');
  });

  it('formatExpiryInput creates MM/YY', () => {
    expect(formatExpiryInput('1230')).toBe('12/30');
    expect(formatExpiryInput('1')).toBe('1');
    expect(formatExpiryInput('0125')).toBe('01/25');
  });

  it('maskCardDisplay shows last 4 when available', () => {
    expect(maskCardDisplay('4242424242424242')).toContain('4242');
    expect(maskCardDisplay('4242')).toContain('4242');
    expect(maskCardDisplay('')).toBe('••••');
  });

  it('validateName enforces minimal name rules', () => {
    expect(validateName('')).toBe('Name required');
    expect(validateName('A')).toBe('Use full name');
    expect(validateName('Vedika Jamdar')).toBe('');
  });

  it('validateCard rejects wrong length and Luhn invalid', () => {
    expect(validateCard('1234')).toBe('Card must be 13–19 digits');
    // Luhn invalid but correct length
    expect(validateCard('4111 1111 1111 1112')).toBe('Invalid card number');
    expect(validateCard('4242 4242 4242 4242')).toBe('');
  });

  describe('validateExpiry (time-sensitive)', () => {
    // Fix current date to 2025-01-15 so tests are stable
    beforeAll(() => {
      vi.setSystemTime(new Date('2025-01-15T00:00:00.000Z'));
    });
    afterAll(() => {
      vi.useRealTimers();
    });

    it('rejects invalid formats and months', () => {
      expect(validateExpiry('1/25')).toBe('Expiry must be MM/YY');
      expect(validateExpiry('13/25')).toBe('Invalid month');
      expect(validateExpiry('00/25')).toBe('Invalid month');
    });

    it('rejects past expiry and accepts future', () => {
      // Jan 2024 is past
      expect(validateExpiry('01/24')).toBe('Card expired');
      // Feb 2025 is future relative to Jan 15, 2025
      expect(validateExpiry('02/25')).toBe('');
      // current month/year should be accepted if month >= current month and year equal
      expect(validateExpiry('01/25')).toBe('');
    });
  });

  it('validateCvv accepts 3 or 4 digit numeric values', () => {
    expect(validateCvv('12')).toBe('CVV must be 3 or 4 digits');
    expect(validateCvv('123')).toBe('');
    expect(validateCvv('1234')).toBe('');
    expect(validateCvv('12a')).toBe('CVV must be 3 or 4 digits');
  });
});
