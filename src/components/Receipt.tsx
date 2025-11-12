// src/components/Receipt.tsx
import type { Component } from "solid-js";

type Props = {
  id: string;
  name: string;
  maskedCard: string;
  amount: string;
  date: string;
};

const Receipt: Component<Props> = (props) => {
  return (
    <div class="receipt">
      <h2 class="receipt-title">Payment Completed</h2>

      <div class="receipt-details">
        <div class="receipt-row"><strong>Transaction ID:</strong> {props.id}</div>
        <div class="receipt-row"><strong>Name:</strong> {props.name}</div>
        <div class="receipt-row"><strong>Card:</strong> {props.maskedCard}</div>
        <div class="receipt-row"><strong>Amount:</strong> {props.amount}</div>
        <div class="receipt-row"><strong>Date:</strong> {props.date}</div>
      </div>

      <a class="btn primary large receipt-btn" href="/">
        Make another payment
      </a>
    </div>
  );
};

export default Receipt;
