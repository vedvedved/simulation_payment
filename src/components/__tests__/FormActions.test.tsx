// src/components/__tests__/FormActions.test.tsx
import { render, screen } from '@solidjs/testing-library';
import FormActions from '../FormActions';

describe('FormActions', () => {
  it('renders Pay label by default and respects disabled prop', () => {
    render(() => <FormActions loading={false} disabled={true} />);

    const btn = screen.getByRole('button', { name: /pay/i }) as HTMLButtonElement;
    expect(btn).toBeInTheDocument();

    // disabled attribute is set as disabled={p.loading || p.disabled}
    expect(btn).toBeDisabled();
    // aria-disabled should also be present
    expect(btn.getAttribute('aria-disabled')).toBe('true');
  });

  it('shows processing text when loading and is disabled', () => {
    render(() => <FormActions loading={true} disabled={false} />);

    const btn = screen.getByRole('button', { name: /processing/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
    expect(btn.getAttribute('aria-disabled')).toBe('true');
  });

  it('uses custom label when provided', () => {
    render(() => <FormActions loading={false} disabled={false} label="Pay Now" />);

    const btn = screen.getByRole('button', { name: /pay now/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeEnabled();
  });
});
