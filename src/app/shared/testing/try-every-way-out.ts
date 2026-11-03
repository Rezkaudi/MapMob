/** Clicks the backdrop, every plain button and presses Escape, as a user who wants out would. */
export function tryEveryWayOut(element: HTMLElement): void {
  element
    .querySelectorAll<HTMLElement>('div, button[type="button"]')
    .forEach((target) => target.click());
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
}
