// src/components/fields/__tests__/CvvField.test.tsx
import { render, screen, fireEvent } from '@solidjs/testing-library';
import CvvField from '../CvvField';
import { processCvvInput } from '../../../lib/formHelpers';
import { vi } from 'vitest';

describe('CvvField (with real processCvvInput)', () => {
  it('renders label and input correctly', () => {
    const setActual = vi.fn();
    const setMasked = vi.fn();

    render(() => (
      <CvvField
        actual=""
        masked=""
        setActual={setActual}
        setMasked={setMasked}
      />
    ));

    const input = screen.getByLabelText(/cvv/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('maxlength', '4');
  });

  it('inserts digits normally (insertText)', () => {
    const setActual = vi.fn();
    const setMasked = vi.fn();

    render(() => (
      <CvvField
        actual=""
        masked=""
        setActual={setActual}
        setMasked={setMasked}
      />
    ));

    const input = screen.getByLabelText(/cvv/i) as HTMLInputElement;

    fireEvent.input(input, {
      target: { value: '1' },
      inputType: 'insertText',
      data: '1',
    });

    // actual = "1"
    expect(setActual).toHaveBeenCalledWith("1");
    expect(setMasked).toHaveBeenCalledWith("•");
  });

  it('ignores non-digit insertText', () => {
    const setActual = vi.fn();
    const setMasked = vi.fn();

    render(() => (
      <CvvField
        actual="1"
        masked="•"
        setActual={setActual}
        setMasked={setMasked}
      />
    ));

    const input = screen.getByLabelText(/cvv/i);

    fireEvent.input(input, {
      target: { value: '1a' }, // raw includes letters, but "a" should be ignored
      inputType: 'insertText',
      data: 'a',
    });

    // actual should remain "1"
    expect(setActual).toHaveBeenCalledWith("1");
    expect(setMasked).toHaveBeenCalledWith("•");
  });

  it('handles delete (deleteContentBackward)', () => {
    const setActual = vi.fn();
    const setMasked = vi.fn();

    render(() => (
      <CvvField
        actual="12"
        masked="••"
        setActual={setActual}
        setMasked={setMasked}
      />
    ));

    const input = screen.getByLabelText(/cvv/i);

    fireEvent.input(input, {
      target: { value: '1' },
      inputType: 'deleteContentBackward'
    });

    // actual should become "1"
    expect(setActual).toHaveBeenCalledWith("1");
    expect(setMasked).toHaveBeenCalledWith("•");
  });

  it('handles paste (insertFromPaste) and strips non-digits', () => {
    const setActual = vi.fn();
    const setMasked = vi.fn();

    render(() => (
      <CvvField
        actual=""
        masked=""
        setActual={setActual}
        setMasked={setMasked}
      />
    ));

    const input = screen.getByLabelText(/cvv/i);

    fireEvent.input(input, {
      target: { value: '12a9' },  // paste includes non-digits but should strip
      inputType: 'insertFromPaste'
    });

    expect(setActual).toHaveBeenCalledWith("129"); // digits only, max 4
    expect(setMasked).toHaveBeenCalledWith("•••");
  });

  it('caps length at 4 digits', () => {
    const setActual = vi.fn();
    const setMasked = vi.fn();

    render(() => (
      <CvvField
        actual="1234"
        masked="••••"
        setActual={setActual}
        setMasked={setMasked}
      />
    ));

    const input = screen.getByLabelText(/cvv/i);

    fireEvent.input(input, {
      target: { value: '12345' }, // attempt to exceed limit
      inputType: 'insertText',
      data: '5',
    });

    // still only max 4 digits
    expect(setActual).toHaveBeenCalledWith("1234");
    expect(setMasked).toHaveBeenCalledWith("••••");
  });

  it('renders error message when error prop is provided', () => {
    const setActual = vi.fn();
    const setMasked = vi.fn();

    render(() => (
      <CvvField
        actual=""
        masked=""
        setActual={setActual}
        setMasked={setMasked}
        error="Invalid CVV"
      />
    ));

    expect(screen.getByText(/invalid cvv/i)).toBeInTheDocument();
  });
});
