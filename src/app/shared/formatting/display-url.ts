const SCHEME = /^[a-z][a-z\d+.-]*:\/\//i;
const TRAILING_SLASH = /\/$/;

/** A link as people read it: no "https://" and no closing slash. */
export function formatDisplayUrl(url: string): string {
  return url.replace(SCHEME, '').replace(TRAILING_SLASH, '');
}
