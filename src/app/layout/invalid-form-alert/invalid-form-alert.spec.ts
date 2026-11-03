import { TestBed } from '@angular/core/testing';
import { InvalidFormAlert } from './invalid-form-alert';

describe('InvalidFormAlert', () => {
  let form: HTMLFormElement;

  beforeEach(() => {
    // jsdom has no scrollIntoView.
    Element.prototype.scrollIntoView = vi.fn();
    form = document.createElement('form');
    document.body.append(form);
  });

  afterEach(() => {
    form.remove();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function submitWith(html: string) {
    const fixture = TestBed.createComponent(InvalidFormAlert);
    fixture.detectChanges();
    form.innerHTML = html;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    // The first pass runs the check after render; the second draws the alert.
    fixture.detectChanges();
    fixture.detectChanges();
    return fixture;
  }

  it('shows the alert and focuses the first empty required field', () => {
    const page = submitWith(
      '<input id="name" class="ng-valid" /><input id="phone" class="ng-invalid" />',
    ).nativeElement as HTMLElement;

    expect(page.querySelector('app-toast')?.textContent).toContain('يرجى تعبئة الحقول المطلوبة');
    expect(document.activeElement?.id).toBe('phone');
  });

  it('stays quiet when the form is valid', () => {
    const page = submitWith('<input id="name" class="ng-valid" />').nativeElement as HTMLElement;

    expect(page.querySelector('app-toast')).toBeNull();
  });

  it('closes when the close button is pressed', () => {
    const fixture = submitWith('<input class="ng-invalid" />');
    const page = fixture.nativeElement as HTMLElement;

    (page.querySelector('[data-testid="toast-close"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(page.querySelector('app-toast')).toBeNull();
  });

  it('hides by itself after a few seconds', () => {
    vi.useFakeTimers();
    const fixture = submitWith('<input class="ng-invalid" />');

    vi.advanceTimersByTime(6000);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-toast')).toBeNull();
  });

  it('also checks the form when a draft button inside it is pressed', () => {
    const fixture = TestBed.createComponent(InvalidFormAlert);
    fixture.detectChanges();
    form.className = 'ng-invalid';
    form.innerHTML =
      '<input id="title" class="ng-invalid" /><button type="button" data-checks-form>draft</button>';

    (form.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-toast')).not.toBeNull();
    expect(document.activeElement?.id).toBe('title');
  });

  it('ignores plain buttons that do not save', () => {
    const fixture = TestBed.createComponent(InvalidFormAlert);
    fixture.detectChanges();
    form.innerHTML = '<input class="ng-invalid" /><button type="button">add row</button>';

    (form.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-toast')).toBeNull();
  });

  it('stays quiet when a draft saves with only a warning showing', () => {
    const fixture = TestBed.createComponent(InvalidFormAlert);
    fixture.detectChanges();
    form.className = 'ng-valid';
    form.innerHTML =
      '<input aria-invalid="true" /><button type="button" data-checks-form>draft</button>';

    (form.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-toast')).toBeNull();
  });
});
