const FOCUSABLE_SELECTOR =
  'input:not([type="hidden"]), select, textarea, button, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

/** Brings the field to the middle of the screen and puts the cursor in it. */
export function revealField(field: HTMLElement): void {
  field.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const target = field.matches(FOCUSABLE_SELECTOR)
    ? field
    : field.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
  // preventScroll keeps the smooth scroll from being cut short by a jump.
  target?.focus({ preventScroll: true });
}
