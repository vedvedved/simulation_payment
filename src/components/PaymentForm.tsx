import { createSignal, createMemo } from "solid-js";

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

  // Derived "form valid" boolean — true only when all checks pass
  const isValid = createMemo(() => {
    // quick checks for required fields
    if (!name().trim()) return false;
    if (!card().trim()) return false;
    if (!expiry().trim()) return false;
    if (!cvv().trim()) return false;

    // if there are any error keys, form is invalid
    if (Object.keys(errors()).length > 0) return false;

    // deeper checks (redundant if validateField already set errors, but defensive)
    const digits = card().replace(/\D/g, "");
    if (!/^\d{13,19}$/.test(digits) || !luhnCheck(digits)) return false;

    const expDigits = expiry().replace(/\D/g, "");
    if (!/^\d{4}$/.test(expDigits)) return false;
    const mm = parseInt(expDigits.slice(0, 2), 10);
    const yy = parseInt(expDigits.slice(2), 10);
    const now = new Date();
    const curY = now.getFullYear() % 100;
    const curM = now.getMonth() + 1;
    if (!(mm >= 1 && mm <= 12)) return false;
    if (yy < curY || (yy === curY && mm < curM)) return false;

    if (!/^\d{3,4}$/.test(cvv())) return false;

    return true;
  });

  // We still keep a small guard on submit — but primarily rely on the disabled button
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
    if (loading()) return;
    // Defensive: if somehow button was enabled while invalid, block and focus first invalid
    if (!isValid()) {
      // find first invalid field and focus it
      const firstErr = Object.keys(errors())[0] as keyof FieldErrors | undefined;
      if (firstErr === "name") nameRef?.focus();
      else if (firstErr === "card") cardRef?.focus();
      else if (firstErr === "expiry") expiryRef?.focus();
      else if (firstErr === "cvv") cvvRef?.focus();
      return;
    }
    simulatePayment();
  };

  return (
    <div class="checkout-wrapper">
      <div class="checkout-card">
        {/* Header  */}
      <div class="checkout-header">
        <h1 class="checkout-title">
          {receipt() ? "Payment Successful" : "Complete your payment"}
        </h1>

        <p class="checkout-sub">
          {receipt()
            ? "Thank you — your transaction was successful."
            : "Secure payment — fast & simple"}
        </p>
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
              <button
                type="submit"
                class="btn pay large"
                disabled={!isValid() || loading()}
                aria-disabled={!isValid() || loading()}
              >
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
            <h2 class="receipt-title">Payment Completed</h2>

            <div class="receipt-details">
              <div class="receipt-row"><strong>Transaction ID:</strong> {receipt()!.id}</div>
              <div class="receipt-row"><strong>Name:</strong> {receipt()!.name}</div>
              <div class="receipt-row"><strong>Card:</strong> {receipt()!.maskedCard}</div>
              <div class="receipt-row"><strong>Amount:</strong> {receipt()!.amount}</div>
              <div class="receipt-row"><strong>Date:</strong> {receipt()!.date}</div>
            </div>

            <button
              class="btn primary large receipt-btn"
              onClick={() => setReceipt(null)}
            >
              Make another payment
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
