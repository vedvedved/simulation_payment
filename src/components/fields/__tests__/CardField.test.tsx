import { render, screen, fireEvent } from '@solidjs/testing-library';
import CardField from '../../fields/CardField';
import { vi } from 'vitest';

describe('CardField', () => {
  it('renders label and input', () => {
    render(() => (
      <CardField value="" onInput={() => {}} />
    ));

    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /card number/i })).toBeInTheDocument();
  });

  it('renders initial value passed through props', () => {
    render(() => (
      <CardField value="4242" onInput={() => {}} />
    ));

    const input = screen.getByLabelText(/card number/i) as HTMLInputElement;
    expect(input.value).toBe("4242");
  });

  it('calls onInput handler when typing', () => {
    const handleInput = vi.fn();

    render(() => (
      <CardField value="" onInput={handleInput} />
    ));

    const input = screen.getByLabelText(/card number/i) as HTMLInputElement;

    fireEvent.input(input, { target: { value: '4' } });

    expect(handleInput).toHaveBeenCalledTimes(1);
    expect(handleInput).toHaveBeenCalledWith('4', expect.any(Event));
  });

  it('renders the error message when provided', () => {
    render(() => (
      <CardField value="" onInput={() => {}} error="Invalid card number" />
    ));

    expect(screen.getByText(/invalid card number/i)).toBeInTheDocument();
  });

  it('does not render error when no error prop is passed', () => {
    render(() => (
      <CardField value="" onInput={() => {}} />
    ));

    expect(screen.queryByText(/invalid|error/i)).not.toBeInTheDocument();
  });
});
