// Turns Arabic-Indic digits (٠١٢٣) into normal digits
function normalizeDigits(text) {
  return (text || "").replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

// The address for a phone call
export function callLink(phone) {
  const cleaned = normalizeDigits(phone).replace(/[^0-9+]/g, "");
  return cleaned ? "tel:" + cleaned : null;
}

// The address for a WhatsApp chat (Egyptian numbers like 01xxxxxxxxx become +20 1xxxxxxxxx)
export function whatsappLink(phone) {
  let digits = normalizeDigits(phone).replace(/[^0-9]/g, "");
  if (!digits) return null;
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = "20" + digits.slice(1);
  return "https://wa.me/" + digits;
}
