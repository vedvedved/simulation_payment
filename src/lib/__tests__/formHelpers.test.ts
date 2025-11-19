// src/lib/__tests__/formHelpers.test.ts
import { describe, it, expect } from 'vitest';
import { processCvvInput, isValidationClear, sanitizeForSubmit } from '../formHelpers';

describe('formHelpers', () => {
  it('processCvvInput - insertText appends digits, ignores non-digits', () => {
    const res1 = processCvvInput('', { inputType: 'insertText', data: '1' } as any, '1');
    expect(res1.actual).toBe('1');
    expect(res1.masked).toBe('•');

    const res2 = processCvvInput('1', { inputType: 'insertText', data: 'a' } as any, '1a');
    // non-digit ignored -> actual remains '1'
    expect(res2.actual).toBe('1');
    expect(res2.masked).toBe('•');
  });

  it('processCvvInput - deleteContentBackward removes last digit', () => {
    const res = processCvvInput('12', { inputType: 'deleteContentBackward' } as any, '1');
    expect(res.actual).toBe('1');
    expect(res.masked).toBe('•');
  });

  it('processCvvInput - paste (insertFromPaste) strips non-digits and caps at 4', () => {
    const res = processCvvInput('', { inputType: 'insertFromPaste' } as any, '12a34b56');
    // should take digits only and slice(0,4) => '1234'
    expect(res.actual).toBe('1234');
    expect(res.masked).toBe('••••');
  });

  it('processCvvInput - unknown inputType falls back to sanitize rawValue', () => {
    const res = processCvvInput('', { inputType: 'somethingElse' } as any, '1a2b');
    expect(res.actual).toBe('12');
    expect(res.masked).toBe('••');
  });

  it('isValidationClear returns true only when all values are empty strings', () => {
    expect(isValidationClear({ name: '', card: '' })).toBe(true);
    expect(isValidationClear({ name: '', card: 'err' })).toBe(false);
  });

  it('sanitizeForSubmit trims name and strips spaces from card', () => {
    const out = sanitizeForSubmit({
      name: ' Vedika ',
      card: '4242 4242 4242 4242',
      expiry: '12/30',
      cvv: '123',
    } as any);
    expect(out.name).toBe('Vedika');
    expect(out.card).toBe('4242424242424242');
    expect(out.maskedCard).toBe('4242 4242 4242 4242');
    expect(out.amount).toBeDefined();
  });
});
