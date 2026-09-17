const ALLOWED_SCHEME = /^(https?|mailto|tel):/i;
const ANY_SCHEME = /^[a-z][a-z\d+.-]*:/i;
const BARE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Cleans a typed link address; `null` means there is nothing safe to link to. */
export function normalizeLinkUrl(typed: string | null): string | null {
  const address = typed?.trim() ?? '';
  if (!address) {
    return null;
  }
  if (ALLOWED_SCHEME.test(address)) {
    return address;
  }
  if (ANY_SCHEME.test(address)) {
    return null;
  }
  return BARE_EMAIL.test(address) ? `mailto:${address}` : `https://${address}`;
}
