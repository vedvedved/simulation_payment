import { createSignal, createMemo, Show, batch } from "solid-js";
import { formatCardInput,formatExpiryInput,validateName,validateCard,validateExpiry,validateCvv,} from "../lib/validators";
import { paymentService } from "../services/paymentService";
import type { ValidationErrors, PaymentFormData } from "../types";

export default function PaymentForm() {
  const [form, setForm] = createSignal<PaymentFormData>({
    name: "",
    card: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = createSignal<ValidationErrors>({});
  const [loading, setLoading] = createSignal(false);
  const [touched, setTouched] = createSignal<Record<keyof PaymentFormData, boolean>>({
    name: false, card: false, expiry: false, cvv: false,
  });
  
  // Track the actual CVV value (unmasked)
  const [actualCvv, setActualCvv] = createSignal("");
  // Track the masked display value
  const [maskedCvv, setMaskedCvv] = createSignal("");
  
  const csrf = "simulated-csrf-token"; // demo only

  const validation = createMemo(() => ({
    name: validateName(form().name),
    card: validateCard(form().card),
    expiry: validateExpiry(form().expiry),
    cvv: validateCvv(actualCvv()), // Validate against actual CVV
  }));

  const isValid = createMemo(() =>
    Object.values(validation()).every((v) => !v)
  );

  // Handle CVV input with masking
  function handleCvvInput(value: string) {
    const currentActual = actualCvv();
    const currentMasked = maskedCvv();
    
    // Remove non-digits
    const digitsOnly = value.replace(/\D/g, "");
    
    // Determine if user is adding or removing characters
    if (value.length > currentMasked.length) {
      // User is typing - add the new digit
      const newDigit = digitsOnly[digitsOnly.length - 1];
      if (newDigit && currentActual.length < 4) {
        const newActual = currentActual + newDigit;
        setActualCvv(newActual);
        setMaskedCvv("•".repeat(newActual.length));
        setForm({ ...form(), cvv: newActual });
      }
    } else {
      // User is deleting
      const newActual = currentActual.slice(0, -1);
      setActualCvv(newActual);
      setMaskedCvv("•".repeat(newActual.length));
      setForm({ ...form(), cvv: newActual });
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    batch(() => setTouched({ name: true, card: true, expiry: true, cvv: true }));
    if (!isValid()) {
      setErrors((p) => ({ ...p, submit: "Fix errors above before paying." }));
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const data = await paymentService.submit(form(), csrf);
      location.href = `/receipt?tx=${encodeURIComponent(data.id)}`;
    } catch (err: any) {
      console.error(err);
      setErrors({ submit: err.message || "Payment failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form class="form" onSubmit={handleSubmit} noValidate aria-busy={loading()}>
      <fieldset disabled={loading()} class="fieldset">
        {/* Name Field */}
        <div class="form-row" id="row-name">
          <label for="name" class="form-label">
            Name on card
          </label>
          <input
            id="name"
            class="input large-input"
            aria-invalid={!!validation().name}
            aria-describedby={validation().name ? "err-name" : undefined}
            type="text"
            value={form().name}
            onInput={(e) => {
              const v = (e.currentTarget as HTMLInputElement).value;
              setForm({ ...form(), name: v });
              setTouched({ ...touched(), name: true });
            }}
            placeholder="Full name"
            autocomplete="cc-name"
          />
          <Show when={touched().name && validation().name}>
            <div id="err-name" class="error" role="alert">
              {validation().name}
            </div>
          </Show>
        </div>

        {/* Card Number Field */}
        <div class="form-row" id="row-card">
          <label for="card" class="form-label">
            Card number
          </label>
          <input
            id="card"
            class="input large-input"
            aria-invalid={!!validation().card}
            aria-describedby={validation().card ? "err-card" : undefined}
            inputMode="numeric"
            type="text"
            value={form().card}
            onInput={(e) => {
              const v = (e.currentTarget as HTMLInputElement).value;
              setForm({ ...form(), card: formatCardInput(v) });
              setTouched({ ...touched(), card: true });
            }}
            placeholder="1234 5678 9012 3456"
            autocomplete="cc-number"
          />
          <Show when={touched().card && validation().card}>
            <div id="err-card" class="error" role="alert">
              {validation().card}
            </div>
          </Show>
        </div>

        {/* Expiry and CVV Grid */}
        <div class="form-grid">
          {/* Expiry Field */}
          <div class="form-row" id="row-expiry">
            <label for="expiry" class="form-label">
              Expiry (MM/YY)
            </label>
            <input
              id="expiry"
              class="input"
              aria-invalid={!!validation().expiry}
              aria-describedby={validation().expiry ? "err-expiry" : undefined}
              inputMode="numeric"
              type="text"
              value={form().expiry}
              onInput={(e) => {
                const v = (e.currentTarget as HTMLInputElement).value;
                setForm({ ...form(), expiry: formatExpiryInput(v) });
                setTouched({ ...touched(), expiry: true });
              }}
              placeholder="MM/YY"
              autocomplete="cc-exp"
            />
            <Show when={touched().expiry && validation().expiry}>
              <div id="err-expiry" class="error" role="alert">
                {validation().expiry}
              </div>
            </Show>
          </div>

          {/* CVV Field with Masking */}
          <div class="form-row" id="row-cvv">
            <label for="cvv" class="form-label">
              CVV
            </label>
            <input
              id="cvv"
              class="input"
              aria-invalid={!!validation().cvv}
              aria-describedby={validation().cvv ? "err-cvv" : undefined}
              inputMode="numeric"
              type="text"
              value={maskedCvv()}
              onInput={(e) => {
                const v = (e.currentTarget as HTMLInputElement).value;
                handleCvvInput(v);
                setTouched({ ...touched(), cvv: true });
              }}
              placeholder="•••"
              autocomplete="cc-csc"
              maxLength={4}
            />
            <Show when={touched().cvv && validation().cvv}>
              <div id="err-cvv" class="error" role="alert">
                {validation().cvv}
              </div>
            </Show>
          </div>
        </div>

        <div class="form-actions">
          <button
            class="btn pay large"
            type="submit"
            disabled={loading() || !isValid()}
          >
            {loading() ? "Processing..." : "Pay ₹499"}
          </button>
        </div>
      </fieldset>

      <Show when={errors().submit}>
        <div class="error" role="alert">{errors().submit}</div>
      </Show>
    </form>
  );
}