import type { PaymentFormData, PaymentRecord } from "../types";

export const paymentService = {
  async submit(form: PaymentFormData, csrf: string): Promise<{ id: string }> {
    const resp = await fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-sim": csrf,
      },
      body: JSON.stringify({
        name: form.name.trim(),
        card: form.card.replace(/\s+/g, ""),
        maskedCard: form.card,
        amount: "₹499.00",
      }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.error || "Server error");
    return data;
  },

  async GET(id: string): Promise<PaymentRecord> {
    const res = await fetch(`/api/payment/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error("Not found");
    return res.json();
  },
};
