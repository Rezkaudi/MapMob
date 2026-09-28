import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { SettingsPasswordField } from './settings-password-field';

function render(error: string | null = null) {
  const control = new FormControl('', { nonNullable: true });
  const fixture = TestBed.createComponent(SettingsPasswordField);
  fixture.componentRef.setInput('label', 'كلمة المرور الحالية');
  fixture.componentRef.setInput('fieldId', 'current-password');
  fixture.componentRef.setInput('control', control);
  fixture.componentRef.setInput('autocomplete', 'current-password');
  fixture.componentRef.setInput('error', error);
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  return { fixture, element, control, input: () => element.querySelector('input')! };
}

describe('SettingsPasswordField', () => {
  it('labels a hidden password input bound to the control', () => {
    const { element, control, input } = render();

    expect(element.querySelector('label')!.getAttribute('for')).toBe('current-password');
    expect(input().id).toBe('current-password');
    expect(input().type).toBe('password');
    expect(input().getAttribute('autocomplete')).toBe('current-password');

    control.setValue('secret-123');
    expect(input().value).toBe('secret-123');
  });

  it('shows the password when the eye is pressed and hides it on the next press', () => {
    const { fixture, element, input } = render();
    const toggle = element.querySelector('button')!;

    toggle.click();
    fixture.detectChanges();
    expect(input().type).toBe('text');

    toggle.click();
    fixture.detectChanges();
    expect(input().type).toBe('password');
  });

  it('marks the input invalid and shows the error it was given', () => {
    const { element, input } = render('أدخل كلمة المرور الحالية');

    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(element.querySelector('[role="alert"]')!.textContent?.trim()).toBe(
      'أدخل كلمة المرور الحالية',
    );
  });
});
