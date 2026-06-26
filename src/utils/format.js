// ── Number formatters (Indian locale) ────────────────────────────────────────

export const pct = (a, b) => (((a - b) / b) * 100).toFixed(2);

export const fmtINR = (n) =>
  '₹' +
  n?.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const fmtVol = (n) =>
  n >= 1e9
    ? (n / 1e9).toFixed(2) + 'B'
    : n >= 1e7
    ? (n / 1e7).toFixed(2) + ' Cr'
    : n >= 1e5
    ? (n / 1e5).toFixed(2) + ' L'
    : n?.toLocaleString('en-IN');

export const fmtMktCap = (price, shares) => {
  const v = price * shares;
  return v >= 1e12
    ? '₹' + (v / 1e12).toFixed(2) + ' L Cr'
    : '₹' + (v / 1e7).toFixed(0) + ' Cr';
};
