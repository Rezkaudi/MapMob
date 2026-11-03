const INVALID_FIELD_SELECTOR = [
  'input.ng-invalid',
  'select.ng-invalid',
  'textarea.ng-invalid',
  '[formcontrolname].ng-invalid',
  '[aria-invalid="true"]',
].join(', ');

/** The first field, in page order, that stops the form from saving. */
export function findFirstInvalidField(form: HTMLElement): HTMLElement | null {
  return form.querySelector<HTMLElement>(INVALID_FIELD_SELECTOR);
}
