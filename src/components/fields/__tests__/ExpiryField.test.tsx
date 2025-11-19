// src/components/fields/__tests__/ExpiryField.test.tsx
import { render, screen, fireEvent } from '@solidjs/testing-library';
import ExpiryField from '../ExpiryField';
import { vi } from 'vitest';

describe('ExpiryField', () => {
  it('renders label and input with given value', () => {
    render(() => <ExpiryField value="12/30" onInput={() => {}} />);
    const input = screen.getByLabelText(/expiry/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('12/30');
  });

  it('calls onInput callback when value changes', async () => {
    const handler = vi.fn();
    render(() => <ExpiryField value="" onInput={handler} />);

    const input = screen.getByLabelText(/expiry/i) as HTMLInputElement;
    fireEvent.input(input, { target: { value: '01/25' } });

    expect(handler).toHaveBeenCalledTimes(1);
    // handler receives (value, event)
    expect(handler.mock.calls[0][0]).toBe('01/25');
    expect(handler.mock.calls[0][1]).toBeTruthy();
  });

  it('renders error message when error prop passed', () => {
    render(() => <ExpiryField value="" onInput={() => {}} error="Invalid expiry" />);
    expect(screen.getByText(/invalid expiry/i)).toBeInTheDocument();
  });
});
