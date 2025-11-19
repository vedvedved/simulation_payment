// src/components/__tests__/Receipt.test.tsx
import { render, screen } from '@solidjs/testing-library';
import Receipt from '../Receipt';

describe('Receipt', () => {
  it('renders transaction details and link', () => {
    const props = {
      id: 'tx_123',
      name: 'Vedika Jamdar',
      maskedCard: '•••• •••• •••• 4242',
      amount: '₹499.00',
      date: '2025-11-19T10:00:00.000Z',
    };

    render(() => <Receipt {...props} />);

    expect(screen.getByRole('region', { name: /payment completed/i })).toBeInTheDocument();
    expect(screen.getByText(/transaction id:/i)).toBeInTheDocument();
    expect(screen.getByText(/tx_123/)).toBeInTheDocument();
    expect(screen.getByText(/vedika jamdar/i)).toBeInTheDocument();
    expect(screen.getByText(/•••• •••• •••• 4242/)).toBeInTheDocument();
    expect(screen.getByText(/₹499.00/)).toBeInTheDocument();

    // Date shows locale string — just check it contains year and time portion from ISO
    expect(screen.getByText((content, node) => content.includes('2025'))).toBeTruthy();

    // Make another payment link exists and points to "/"
    const link = screen.getByRole('link', { name: /make another payment/i }) as HTMLAnchorElement;
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/');
  });
});
