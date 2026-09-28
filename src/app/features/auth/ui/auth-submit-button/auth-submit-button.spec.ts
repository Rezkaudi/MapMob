import { TestBed } from '@angular/core/testing';
import { AuthSubmitButton } from './auth-submit-button';

function render(isBusy: boolean) {
  const fixture = TestBed.createComponent(AuthSubmitButton);
  fixture.componentRef.setInput('label', 'تأكيد الرمز');
  fixture.componentRef.setInput('busyLabel', 'جاري التحقق');
  fixture.componentRef.setInput('isBusy', isBusy);
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('button') as HTMLButtonElement;
}

describe('AuthSubmitButton', () => {
  it('submits the form it sits in', () => {
    const button = render(false);

    expect(button.type).toBe('submit');
    expect(button.textContent!.trim()).toBe('تأكيد الرمز');
    expect(button.disabled).toBe(false);
  });

  it('spins and blocks a second submit while busy', () => {
    const button = render(true);

    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('app-spinner')).toBeTruthy();
  });
});
