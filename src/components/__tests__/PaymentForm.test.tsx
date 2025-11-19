// src/components/__tests__/PaymentForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import PaymentForm from '../PaymentForm';
import { paymentService } from '../../services/paymentService';
import { vi } from 'vitest';

describe('PaymentForm (integration)', () => {
  beforeEach(() => {
    // ensure submit exists and is mockable
    (paymentService as any).submit = vi.fn();

    vi.clearAllMocks();

    // writable window.location
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });
  });

  it('initially shows form and submit button disabled', () => {
    render(() => <PaymentForm />);
    const btn = screen.getByRole('button', { name: /pay/i });

    const aria = btn.getAttribute('aria-disabled');
    if (aria !== null) expect(aria).toBe('true');
    else expect(btn).toBeDisabled();
  });

  it('submits when valid, enters loading state, then redirects on success', async () => {
    // Create a controllable pending promise
    let resolveSubmit: (v: any) => void;
    const submitPromise = new Promise((res) => {
      resolveSubmit = res;
    });

    // Mock submit => returns pending promise
    (paymentService as any).submit.mockImplementationOnce(() => submitPromise);

    render(() => <PaymentForm />);

    // Fill valid form
    await userEvent.type(screen.getByLabelText(/name on card/i), 'Vedika Jamdar');
    await userEvent.type(screen.getByLabelText(/card number/i), '4242 4242 4242 4242');
    await userEvent.type(screen.getByLabelText(/expiry/i), '12/30');
    await userEvent.type(screen.getByLabelText(/cvv/i), '123');

    const btn = screen.getByRole('button', { name: /pay/i });

    // Wait until form becomes valid & button enabled
    await waitFor(() => {
      const aria = btn.getAttribute('aria-disabled');
      if (aria !== null) expect(aria).toBe('false');
      else expect(btn).toBeEnabled();
    });

    // Click submit (submitPromise still pending)
    await userEvent.click(btn);

    // While submitPromise is pending: loading = true → button should be disabled
    await waitFor(() => {
      const ariaDuring = btn.getAttribute('aria-disabled');
      if (ariaDuring !== null) {
        expect(ariaDuring).toBe('true');
      } else {
        expect(btn).toBeDisabled();
      }
    });

    // Resolve submit
    resolveSubmit!({ id: 'tx_456' });

    // Assert redirect after resolution
    await waitFor(() => {
      expect((paymentService as any).submit).toHaveBeenCalledTimes(1);
      expect(window.location.href).toContain('tx_456');
      expect(window.location.href).toMatch(/\/receipt\?tx=/);
    });
  });

  it('shows error when submit rejects and button is re-enabled', async () => {
    (paymentService as any).submit.mockRejectedValueOnce(new Error('Simulated failure'));

    render(() => <PaymentForm />);

    // Fill valid form
    await userEvent.type(screen.getByLabelText(/name on card/i), 'A B');
    await userEvent.type(screen.getByLabelText(/card number/i), '4242 4242 4242 4242');
    await userEvent.type(screen.getByLabelText(/expiry/i), '12/30');
    await userEvent.type(screen.getByLabelText(/cvv/i), '123');

    const btn = screen.getByRole('button', { name: /pay/i });

    await waitFor(() => {
      const aria = btn.getAttribute('aria-disabled');
      if (aria !== null) expect(aria).toBe('false');
      else expect(btn).toBeEnabled();
    });

    await userEvent.click(btn);

    // After rejection, error message should appear
    await waitFor(() => {
      expect(screen.getByText(/simulated failure|payment failed|error/i)).toBeInTheDocument();
    });

    // Now button should be re-enabled
    await waitFor(() => {
      const aria = btn.getAttribute('aria-disabled');
      if (aria !== null) expect(aria).toBe('false');
      else expect(btn).toBeEnabled();
    });

    // And no redirect should have occurred
    expect(window.location.href).toBe('');
  });
});
