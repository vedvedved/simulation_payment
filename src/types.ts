export type PaymentRecord = {
  id: string;
  name: string;
  maskedCard: string;
  amount: string;
  date: string; // ISO
  expiry?: string;
};
