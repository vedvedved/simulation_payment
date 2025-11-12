function luhnCheck(cardNumber) {
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
function validateName(name) {
  if (!name || !name.trim()) return "Name required";
  if (name.trim().length < 2) return "Use full name";
  return "";
}
function validateCard(card) {
  const digits = card.replace(/\D/g, "");
  if (!/^\d{13,19}$/.test(digits)) return "Card must be 13–19 digits";
  if (!luhnCheck(digits)) return "Invalid card number";
  return "";
}
function validateExpiry(expiry) {
  const digits = expiry.replace(/\D/g, "");
  if (!/^\d{4}$/.test(digits)) return "Expiry must be MM/YY";
  const mm = Number(digits.slice(0, 2));
  const yy = Number(digits.slice(2, 4));
  if (mm < 1 || mm > 12) return "Invalid month";
  const now = /* @__PURE__ */ new Date();
  const currYY = Number(String(now.getFullYear()).slice(2));
  const currMM = now.getMonth() + 1;
  if (yy < currYY || yy === currYY && mm < currMM) return "Card expired";
  return "";
}
function validateCvv(cvv) {
  const d = cvv.replace(/\D/g, "");
  if (!/^\d{3,4}$/.test(d)) return "CVV must be 3 or 4 digits";
  return "";
}

export { validateCard as a, validateExpiry as b, validateCvv as c, luhnCheck as l, validateName as v };
