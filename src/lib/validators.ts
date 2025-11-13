// ===== Validation and formatting helpers =====
export function luhnCheck(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  let sum = 0, alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = +digits[i];
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return !!digits && sum % 10 === 0;
}

export const formatCardInput = (v: string) =>
  v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();

export const formatExpiryInput = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length <= 2 ? d : d.slice(0, 2) + "/" + d.slice(2);
};

export const maskCardDisplay = (v: string) => {
  const d = v.replace(/\D/g, "");
  return d.length >= 4 ? `•••• •••• •••• ${d.slice(-4)}` : "••••";
};

// ---------- individual validators ----------
export const validateName = (n: string) =>
  !n.trim() ? "Name required" : n.trim().length < 2 ? "Use full name" : "";

export const validateCard = (c: string) => {
  const d = c.replace(/\D/g, "");
  if (!/^\d{13,19}$/.test(d)) return "Card must be 13–19 digits";
  if (!luhnCheck(d)) return "Invalid card number";
  return "";
};

export const validateExpiry = (e: string) => {
  const d = e.replace(/\D/g, "");
  if (!/^\d{4}$/.test(d)) return "Expiry must be MM/YY";
  const mm = +d.slice(0, 2);
  const yy = +d.slice(2);
  const now = new Date();
  const cYY = +String(now.getFullYear()).slice(2);
  const cMM = now.getMonth() + 1;
  if (mm < 1 || mm > 12) return "Invalid month";
  if (yy < cYY || (yy === cYY && mm < cMM)) return "Card expired";
  return "";
};

export const validateCvv = (cvv: string) =>
  /^\d{3,4}$/.test(cvv) ? "" : "CVV must be 3 or 4 digits";
