// src/components/PaymentForm.tsx
import { createSignal } from "solid-js";

export default function PaymentForm() {
  const [name, setName] = createSignal("");
  const [card, setCard] = createSignal("");
  const [expiry, setExpiry] = createSignal("");
  const [cvv, setCvv] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const onCardInput = (value: string) => {
    const raw = value.replace(/\D/g, "").slice(0, 19);
    const spaced = raw.replace(/(.{4})/g, "$1 ").trim();
    setCard(spaced);
  };

  const onExpiryInput = (value: string) => {
    const raw = value.replace(/\D/g, "").slice(0, 4);
    if (raw.length <= 2) setExpiry(raw);
    else setExpiry(raw.slice(0, 2) + "/" + raw.slice(2));
  };

  const maskCard = (num: string) => {
    const d = num.replace(/\D/g, "");
    return d.length >= 4 ? "•••• •••• •••• " + d.slice(-4) : "••••";
  };

  const validate = () => {
    const cardDigits = card().replace(/\D/g, "");
    const exp = expiry().replace(/\D/g, "");
    const cv = cvv().replace(/\D/g, "");
    if (!name().trim()) return "Name is required";
    if (cardDigits.length < 13 || cardDigits.length > 19) return "Invalid card number";
    if (exp.length !== 4) return "Expiry must be MM/YY";
    if (cv.length < 3 || cv.length > 4) return "Invalid CVV";
    return "";
  };

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name().trim(),
          card: card().replace(/\s+/g, ""),
          maskedCard: maskCard(card()),
          expiry: expiry(),
          cvv: cvv(),
          amount: "₹499.00",
        }),
      });
      const data = await resp.json();
      if (resp.ok && data.id) {
        location.href = `/receipt?tx=${encodeURIComponent(data.id)}`;
      } else {
        setError(data?.error || "Server error");
      }
    } catch {
      setError("Network error");
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
        />
      </div>

      <div class="form-row">
        <label class="form-label">Card number</label>
        <input
          class="input large-input"
          inputMode="numeric"
          placeholder="1234 5678 9012 3456"
          value={card()}
          onInput={(e) => onCardInput((e.currentTarget as HTMLInputElement).value)}
        />
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
          />
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
            onInput={(e) => setCvv((e.currentTarget as HTMLInputElement).value.replace(/\D/g, ""))}
          />
        </div>
      </div>

      <div class="form-actions">
        <button class="btn pay large" type="submit" disabled={loading()}>
          {loading() ? "Processing..." : "Pay ₹499"}
        </button>
      </div>

      {error() && (
        <div class="error" role="alert">
          {error()}
        </div>
      )}
    </form>
  );
}
