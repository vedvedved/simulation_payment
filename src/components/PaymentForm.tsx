import { createSignal, createMemo, Show } from "solid-js";
import {
  formatCardInput,
  formatExpiryInput,
  maskCardDisplay,
  validateName,
  validateCard,
  validateExpiry,
  validateCvv,
} from "../lib/validators";

export default function PaymentForm() {
  const [name, setName] = createSignal("");
  const [card, setCard] = createSignal("");
  const [expiry, setExpiry] = createSignal("");
  const [cvv, setCvv] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [fieldErrors, setFieldErrors] = createSignal({
    name: "",
    card: "",
    expiry: "",
    cvv: "",
    global: "",
  });

  // derived validity: enable pay only when all fields pass validation
  const isValid = createMemo(() => {
    const eName = validateName(name());
    const eCard = validateCard(card());
    const eExp = validateExpiry(expiry());
    const eCvv = validateCvv(cvv());
    // set inline errors so UI updates as user types
    setFieldErrors({
      name: eName,
      card: eCard,
      expiry: eExp,
      cvv: eCvv,
      global: "",
    });
    return !eName && !eCard && !eExp && !eCvv;
  });

  const onCardInput = (v: string) => setCard(formatCardInput(v));
  const onExpiryInput = (v: string) => setExpiry(formatExpiryInput(v));
  const onCvvInput = (v: string) => setCvv(v.replace(/\D/g, "").slice(0, 4));

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    // final check
    if (!isValid()) {
      setFieldErrors((prev) => ({ ...prev, global: "Fix errors above before paying." }));
      return;
    }
    setFieldErrors((p) => ({ ...p, global: "" }));
    setLoading(true);

    try {
      const resp = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name().trim(),
          card: card().replace(/\s+/g, ""),
          maskedCard: maskCardDisplay(card()),
          expiry: expiry(),
          cvv: cvv(),
          amount: "₹499.00",
        }),
      });

      const data = await resp.json();
      if (resp.ok && data.id) {
        // safe navigation to receipt page
        location.href = `/receipt?tx=${encodeURIComponent(data.id)}`;
      } else {
        setFieldErrors((p) => ({ ...p, global: data?.error || "Server error" }));
      }
    } catch (err) {
      setFieldErrors((p) => ({ ...p, global: "Network error" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form class="form" onSubmit={onSubmit} noValidate>
      <div class="form-row">
        <label class="form-label">Name on card</label>
        <input
          class="input large-input"
          value={name()}
          onInput={(e) => setName((e.currentTarget as HTMLInputElement).value)}
          placeholder="Full name"
          autocomplete="cc-name"
        />
        <Show when={fieldErrors().name}>
          <div class="error" role="alert">{fieldErrors().name}</div>
        </Show>
      </div>

      <div class="form-row">
        <label class="form-label">Card number</label>
        <input
          class="input large-input"
          inputMode="numeric"
          placeholder="1234 5678 9012 3456"
          value={card()}
          onInput={(e) => onCardInput((e.currentTarget as HTMLInputElement).value)}
          autocomplete="cc-number"
        />
        <Show when={fieldErrors().card}>
          <div class="error" role="alert">{fieldErrors().card}</div>
        </Show>
      </div>

      <div class="form-grid">
        <div>
          <label class="form-label">Expiry (MM/YY)</label>
          <input
            class="input"
            inputMode="numeric"
            placeholder="MM/YY"
            value={expiry()}
            onInput={(e) => onExpiryInput((e.currentTarget as HTMLInputElement).value)}
            autocomplete="cc-exp"
          />
          <Show when={fieldErrors().expiry}>
            <div class="error" role="alert">{fieldErrors().expiry}</div>
          </Show>
        </div>

        <div>
          <label class="form-label">CVV</label>
          <input
            class="input"
            type="password"
            inputMode="numeric"
            placeholder="***"
            maxLength={4}
            value={cvv()}
            onInput={(e) => onCvvInput((e.currentTarget as HTMLInputElement).value)}
            autocomplete="cc-csc"
          />
          <Show when={fieldErrors().cvv}>
            <div class="error" role="alert">{fieldErrors().cvv}</div>
          </Show>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn pay large" type="submit" disabled={!isValid() || loading()}>
          {loading() ? "Processing..." : "Pay ₹499"}
        </button>
      </div>

      <Show when={fieldErrors().global}>
        <div class="error" role="alert">{fieldErrors().global}</div>
      </Show>
    </form>
  );
}
