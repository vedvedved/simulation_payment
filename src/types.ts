export interface PaymentFormData {
  name: string;
  card: string;
  expiry: string;
  cvv: string;
}

export interface ValidationErrors {
  name?: string;
  card?: string;
  expiry?: string;
  cvv?: string;
  submit?: string;
}

export interface PaymentRecord {
  id: string;
  name: string;
  maskedCard: string;
  amount: string;
  date: string; // ISO
}
