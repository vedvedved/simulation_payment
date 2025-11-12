// centralized validators + format helpers
export function luhnCheck(cardNumber: string) {
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
  return !!digits && sum % 10 === 0;
}

export function formatCardInput(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiryInput(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + "/" + d.slice(2);
}

export function maskCardDisplay(card: string) {
  const d = card.replace(/\D/g, "");
  return d.length >= 4 ? `•••• •••• •••• ${d.slice(-4)}` : "••••";
}

export function validateName(name: string) {
  if (!name || !name.trim()) return "Name required";
  if (name.trim().length < 2) return "Use full name";
  return "";
}

export function validateCard(card: string) {
  const digits = card.replace(/\D/g, "");
  if (!/^\d{13,19}$/.test(digits)) return "Card must be 13–19 digits";
  if (!luhnCheck(digits)) return "Invalid card number";
  return "";
}

export function validateExpiry(expiry: string) {
  const digits = expiry.replace(/\D/g, "");
  if (!/^\d{4}$/.test(digits)) return "Expiry must be MM/YY";
  const mm = Number(digits.slice(0, 2));
  const yy = Number(digits.slice(2, 4));
  if (mm < 1 || mm > 12) return "Invalid month";
  // expiry check against current date (MM/YY)
  const now = new Date();
  const currYY = Number(String(now.getFullYear()).slice(2));
  const currMM = now.getMonth() + 1;
  if (yy < currYY || (yy === currYY && mm < currMM)) return "Card expired";
  return "";
}

export function validateCvv(cvv: string) {
  const d = cvv.replace(/\D/g, "");
  if (!/^\d{3,4}$/.test(d)) return "CVV must be 3 or 4 digits";
  return "";
}
