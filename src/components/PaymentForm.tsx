import { createSignal } from "solid-js";

type Receipt = {
  id: string;
  name: string;
  maskedCard: string;
  amount: string;
  date: string;
};

type FieldErrors = {
  name?: string;
  card?: string;
  expiry?: string;
  cvv?: string;
};

// Luhn algorithm for card validation
function luhnCheck(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, "");
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits.charAt(i), 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export default function PaymentForm() {
  const [showForm, setShowForm] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [receipt, setReceipt] = createSignal<Receipt | null>(null);

  const [name, setName] = createSignal("");
  const [card, setCard] = createSignal("");
  const [expiry, setExpiry] = createSignal("");
  const [cvv, setCvv] = createSignal("");

  const [errors, setErrors] = createSignal<FieldErrors>({});

  // refs for focusing invalid field
  let nameRef: HTMLInputElement | undefined;
  let cardRef: HTMLInputElement | undefined;
  let expiryRef: HTMLInputElement | undefined;
  let cvvRef: HTMLInputElement | undefined;

  const maskCard = (cardNum: string) => {
    const clean = cardNum.replace(/\s+/g, "");
    if (clean.length < 4) return "••••";
    return "•••• •••• •••• " + clean.slice(-4);
  };

  // format card input groups of 4, limit to 19 digits
  const onCardInput = (value: string) => {
    const raw = value.replace(/\D/g, "").slice(0, 19);
    const spaced = raw.replace(/(.{4})/g, "$1 ").trim();
    setCard(spaced);
    validateField("card", spaced);
  };

  // expiry: accept digits only, auto-insert slash -> MM/YY
  const onExpiryInput = (value: string) => {
    const raw = value.replace(/\D/g, "").slice(0, 4); // MMYY
    if (raw.length <= 2) {
      setExpiry(raw);
      validateField("expiry", raw);
    } else {
      const formatted = raw.slice(0, 2) + "/" + raw.slice(2);
      setExpiry(formatted);
      validateField("expiry", formatted);
    }
  };

  const onCvvInput = (value: string) => {
    const raw = value.replace(/\D/g, "").slice(0, 4);
    setCvv(raw);
    validateField("cvv", raw);
  };

  const validateField = (field: keyof FieldErrors, rawValue?: string) => {
    const currentErrors = { ...errors() };

    const value =
      typeof rawValue !== "undefined"
        ? rawValue
        : field === "name"
        ? name()
        : field === "card"
        ? card()
        : field === "expiry"
        ? expiry()
        : cvv();

    // NAME
    if (field === "name") {
      if (!value.trim()) currentErrors.name = "Name is required.";
      else delete currentErrors.name;
    }

    // CARD
    if (field === "card") {
      const digits = value.replace(/\s+/g, "");
      if (!/^\d{13,19}$/.test(digits)) {
        currentErrors.card = "Card must be 13–19 digits.";
      } else if (!luhnCheck(digits)) {
        currentErrors.card = "Card number looks invalid.";
      } else {
        delete currentErrors.card;
      }
    }

    // EXPIRY
    if (field === "expiry") {
      const digits = value.replace(/\D/g, "");
      if (!/^\d{4}$/.test(digits)) {
        currentErrors.expiry = "Expiry must be MM/YY.";
      } else {
        const mm = parseInt(digits.slice(0, 2), 10);
        const yy = parseInt(digits.slice(2), 10);
        if (!(mm >= 1 && mm <= 12)) {
          currentErrors.expiry = "Expiry month must be 01–12.";
        } else {
          const now = new Date();
          const curY = now.getFullYear() % 100;
          const curM = now.getMonth() + 1;
          if (yy < curY || (yy === curY && mm < curM)) {
            currentErrors.expiry = "Card has expired.";
          } else {
            delete currentErrors.expiry;
          }
        }
      }
    }

    // CVV
    if (field === "cvv") {
      if (!/^\d{3,4}$/.test(value)) currentErrors.cvv = "CVV must be 3 or 4 digits.";
      else delete currentErrors.cvv;
    }

    setErrors(currentErrors);
    return currentErrors;
  };

  const validateAll = () => {
    const fields: (keyof FieldErrors)[] = ["name", "card", "expiry", "cvv"];
    let lastErrors: FieldErrors = { ...errors() };

    for (const f of fields) {
      const res = validateField(f);
      lastErrors = { ...lastErrors, ...res };
    }

    const keys = Object.keys(lastErrors);
    if (keys.length > 0) {
      const first = keys[0] as keyof FieldErrors;
      if (first === "name") nameRef?.focus();
      else if (first === "card") cardRef?.focus();
      else if (first === "expiry") expiryRef?.focus();
      else if (first === "cvv") cvvRef?.focus();
      return false;
    }
    return true;
  };

  const simulatePayment = () => {
    setLoading(true);
    setTimeout(() => {
      const id = "TXN-" + Math.random().toString(36).slice(2, 10).toUpperCase();
      setReceipt({
        id,
        name: name(),
        maskedCard: maskCard(card()),
        amount: "₹499.00",
        date: new Date().toLocaleString(),
      });
      setLoading(false);
      setShowForm(false);
      setName("");
      setCard("");
      setExpiry("");
      setCvv("");
      setErrors({});
    }, 1200);
  };

  const onSubmit = (e: Event) => {
    e.preventDefault();
    if (!validateAll()) return;
    simulatePayment();
  };

  return (
    <div class="checkout-wrapper">
      <div class="checkout-card">
        {/* Header */}
        <div class="checkout-header">
          <h1 class="checkout-title">Complete your payment</h1>
          <p class="checkout-sub">Secure payment — fast & simple</p>
        </div>

        <hr class="checkout-sep" />

        {/* Amount / CTA */}
        <div class="checkout-top">
          <div class="amount-block">
            <div class="amount-label">Amount</div>
            <div class="amount-value">₹499.00</div>
          </div>

          {!receipt() && !showForm() && (
            <div class="cta-block">
              <button class="btn primary large" onClick={() => setShowForm(true)}>
                Proceed to Payment
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        {!receipt() && showForm() && (
          <form class="form" onSubmit={onSubmit} noValidate>
            <div class="form-row">
              <label class="form-label">Name on card</label>
              <input
                ref={nameRef}
                class="input large-input"
                value={name()}
                onInput={(e) => {
                  setName((e.currentTarget as HTMLInputElement).value);
                  validateField("name");
                }}
                aria-invalid={!!errors().name}
                aria-describedby={errors().name ? "err-name" : undefined}
                placeholder="Full name"
              />
              {errors().name && (
                <div id="err-name" class="error" role="alert">
                  {errors().name}
                </div>
              )}
            </div>

            <div class="form-row">
              <label class="form-label">Card number</label>
              <input
                ref={cardRef}
                inputMode="numeric"
                class="input large-input"
                value={card()}
                onInput={(e) => onCardInput((e.currentTarget as HTMLInputElement).value)}
                aria-invalid={!!errors().card}
                aria-describedby={errors().card ? "err-card" : undefined}
                placeholder="1234 5678 9012 3456"
              />
              {errors().card && (
                <div id="err-card" class="error" role="alert">
                  {errors().card}
                </div>
              )}
            </div>

            <div class="form-grid">
              <div>
                <label class="form-label">Expiry (MM/YY)</label>
                <input
                  ref={expiryRef}
                  inputMode="numeric"
                  class="input"
                  value={expiry()}
                  onInput={(e) => onExpiryInput((e.currentTarget as HTMLInputElement).value)}
                  aria-invalid={!!errors().expiry}
                  aria-describedby={errors().expiry ? "err-expiry" : undefined}
                  placeholder="MM/YY"
                />
                {errors().expiry && (
                  <div id="err-expiry" class="error" role="alert">
                    {errors().expiry}
                  </div>
                )}
              </div>

              <div>
                <label class="form-label">CVV</label>
                <input
                  ref={cvvRef}
                  type="password"
                  inputMode="numeric"
                  class="input"
                  value={cvv()}
                  onInput={(e) => onCvvInput((e.currentTarget as HTMLInputElement).value)}
                  aria-invalid={!!errors().cvv}
                  aria-describedby={errors().cvv ? "err-cvv" : undefined}
                  placeholder="***"
                />
                {errors().cvv && (
                  <div id="err-cvv" class="error" role="alert">
                    {errors().cvv}
                  </div>
                )}
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn pay large" disabled={loading()}>
                {loading() ? "Processing..." : "Pay ₹499"}
              </button>

              <button
                type="button"
                class="btn ghost"
                onClick={() => {
                  setShowForm(false);
                  setErrors({});
                }}
                disabled={loading()}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Receipt */}
        {receipt() && (
          <div class="receipt">
            <h2 class="receipt-title">Payment Confirmed</h2>
            <div class="receipt-row">
              <strong>Transaction ID:</strong> {receipt()!.id}
            </div>
            <div class="receipt-row">
              <strong>Name:</strong> {receipt()!.name}
            </div>
            <div class="receipt-row">
              <strong>Card:</strong> {receipt()!.maskedCard}
            </div>
            <div class="receipt-row">
              <strong>Amount:</strong> {receipt()!.amount}
            </div>
            <div class="receipt-row">
              <strong>Date:</strong> {receipt()!.date}
            </div>

            <div class="form-actions" style={{ "margin-top": "18px" }}>
              <button
                class="btn large"
                onClick={() => {
                  setReceipt(null);
                }}
              >
                Make another payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
