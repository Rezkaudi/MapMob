/** The printed sheet: an A4 page with the name, caption, a 90mm code and the link, centred. */
export const QR_CODE_PRINT_STYLES = `
@page { size: A4; margin: 20mm; }
body {
  margin: 0;
  padding-top: 20mm;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6mm;
  text-align: center;
  color: #0f172a;
  font-family: 'Tajawal', 'Cairo', sans-serif;
}
h1 { margin: 0; font-size: 28pt; font-weight: 700; }
[data-role='caption'] { margin: 0; font-family: 'Cairo', 'Tajawal', sans-serif; font-size: 13pt; color: #64748b; }
svg { width: 90mm; height: 90mm; }
[data-role='link'] { margin: 0; direction: ltr; font-family: 'Liberation Mono', monospace; font-size: 13pt; color: #334155; }
`;
