// src/type.ts
export type PaymentRecord = {
  id: string;
  name: string;
  maskedCard: string;
  amount: string;
  date: string;
  expiry?: string;
  cvv?: string; // placeholder only; skip in production
};
