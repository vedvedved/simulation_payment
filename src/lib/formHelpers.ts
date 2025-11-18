import type { PaymentFormData } from "../types";


export function processCvvInput(currentActual: string, inputEvent: InputEvent | undefined, rawValue: string) {
let newActual = currentActual ?? "";
const inputType = inputEvent?.inputType ?? "";
const data = inputEvent?.data ?? null;
try {
if (inputType === "insertFromPaste" || inputType === "insertFromDrop") {
newActual = rawValue.replace(/\D/g, "").slice(0, 4);
} else if (inputType === "insertText") {
const ch = String(data ?? "");
const digit = ch.replace(/\D/g, "");
if (digit) newActual = (currentActual + digit).slice(0, 4);
} else if (inputType.startsWith("delete") || inputType === "deleteContentBackward") {
newActual = currentActual.slice(0, -1);
} else {
newActual = rawValue.replace(/\D/g, "").slice(0, 4);
if (!newActual && currentActual) newActual = currentActual;
}
} catch {
newActual = rawValue.replace(/\D/g, "").slice(0, 4) || currentActual;
}
return { actual: newActual, masked: "•".repeat(newActual.length) };
}


export function isValidationClear(validation: Record<string, string>) {
return Object.values(validation).every((v) => v === "");
}


export function sanitizeForSubmit(form: PaymentFormData) {
return {
name: (form.name ?? "").trim(),
card: (form.card ?? "").replace(/\s+/g, ""),
maskedCard: form.card ?? "",
amount: "₹499.00",
expiry: form.expiry ?? "",
cvv: form.cvv ?? "",
};
}