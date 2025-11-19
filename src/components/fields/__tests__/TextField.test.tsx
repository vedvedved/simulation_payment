// src/components/fields/__tests__/TextField.test.tsx
import { render, screen, fireEvent } from '@solidjs/testing-library';
import TextField from '../TextField';
import { vi } from 'vitest';

describe('TextField', () => {
  it('renders label tied to input id and shows placeholder', () => {
    render(() => <TextField id="name" label="Name on card" value="" onInput={() => {}} placeholder="Full name" />);
    const input = screen.getByLabelText(/name on card/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.placeholder).toBe('Full name');
    expect(input.id).toBe('name');
  });

  it('passes inputMode prop through to input when provided', () => {
    render(() => <TextField id="email" label="Email" value="" onInput={() => {}} inputMode="email" />);
    const input = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(input.getAttribute('inputmode')).toBe('email');
  });

  it('calls onInput with (value, event) when typed into', () => {
    const handler = vi.fn();
    render(() => <TextField id="name" label="Name on card" value="" onInput={handler} />);

    const input = screen.getByLabelText(/name on card/i) as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'Vedika' } });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0]).toBe('Vedika'); // first arg is value
    expect(handler.mock.calls[0][1]).toBeTruthy(); // event object
  });

  it('renders error box with role="alert" when error prop is provided', () => {
    render(() => <TextField id="name" label="Name on card" value="" onInput={() => {}} error="Name required" />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert.textContent).toMatch(/name required/i);
  });

  it('does not render error when error prop is absent', () => {
    render(() => <TextField id="name" label="Name on card" value="" onInput={() => {}} />);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
