// src/components/PaymentForm.tsx
import { createSignal, createMemo, Show, batch } from "solid-js";
import TextField from "./fields/TextField";
import CardField from "./fields/CardField";
import ExpiryField from "./fields/ExpiryField";
import CvvField from "./fields/CvvField";
import FormActions from "./FormActions";
import { formatCardInput, formatExpiryInput, validateName, validateCard, validateExpiry, validateCvv } from "../lib/validators";
import { paymentService } from "../services/paymentService";
import { isValidationClear, sanitizeForSubmit } from "../lib/formHelpers";

export default function PaymentForm() {
  const [form, setForm] = createSignal({ name: "", card: "", expiry: "", cvv: "" });
  const [actualCvv, setActualCvv] = createSignal("");
  const [maskedCvv, setMaskedCvv] = createSignal("");
  const [touched, setTouched] = createSignal({ name: false, card: false, expiry: false, cvv: false });
  const [loading, setLoading] = createSignal(false);
  const [errors, setErrors] = createSignal<Record<string, string>>({});

  const validation = createMemo(() => ({
    name: validateName(form().name),
    card: validateCard(form().card),
    expiry: validateExpiry(form().expiry),
    cvv: validateCvv(actualCvv()),
  }));
  const isValid = createMemo(() => isValidationClear(validation()));

  async function onSubmit(e: Event) {
    e.preventDefault();
    batch(() => setTouched({ name: true, card: true, expiry: true, cvv: true }));
    if (!isValid()) return setErrors({ submit: "Fix errors before paying." });
    setErrors({});
    setLoading(true);
    try {
      const d = await paymentService.submit(sanitizeForSubmit(form()) as any, "simulated-csrf-token");
      location.href = `/receipt?tx=${encodeURIComponent(d.id)}`;
    } catch (err: any) {
      setErrors({ submit: err?.message || "Payment failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form class="form" onSubmit={onSubmit} noValidate>
      <TextField
        id="name"
        label="Name on card"
        value={form().name}
        onInput={(v) => { setForm({ ...form(), name: v }); setTouched({ ...touched(), name: true }); }}
        error={touched().name ? validation().name : ""}
      />

      <CardField
        value={form().card}
        onInput={(v) => { setForm({ ...form(), card: formatCardInput(v) }); setTouched({ ...touched(), card: true }); }}
        error={touched().card ? validation().card : ""}
      />

      <div class="form-grid">
        <ExpiryField
          value={form().expiry}
          onInput={(v) => { setForm({ ...form(), expiry: formatExpiryInput(v) }); setTouched({ ...touched(), expiry: true }); }}
          error={touched().expiry ? validation().expiry : ""}
        />

        <CvvField
          actual={actualCvv()}
          masked={maskedCvv()}
          setActual={setActualCvv}
          setMasked={setMaskedCvv}
          error={touched().cvv ? validation().cvv : ""}
        />
      </div>

      <FormActions loading={loading()} disabled={!isValid()} />
      <Show when={errors().submit}><div class="error">{errors().submit}</div></Show>
    </form>
  );
}
