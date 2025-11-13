import type { Component } from "solid-js";

type Props = {
  id: string;
  name: string;
  maskedCard: string;
  amount: string;
  date: string;
};

const Receipt: Component<Props> = (p) => (
  <div class="receipt" role="region" aria-labelledby="receipt-title">
    <h2 id="receipt-title" class="receipt-title">Payment Completed</h2>
    <div class="receipt-details">
      <p><strong>Transaction ID:</strong> {p.id}</p>
      <p><strong>Name:</strong> {p.name}</p>
      <p><strong>Card:</strong> {p.maskedCard}</p>
      <p><strong>Amount:</strong> {p.amount}</p>
      <p><strong>Date:</strong> {new Date(p.date).toLocaleString()}</p>
    </div>
    <a class="btn primary large" href="/">Make another payment</a>
  </div>
);

export default Receipt;
