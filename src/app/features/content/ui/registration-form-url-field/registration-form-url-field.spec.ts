import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { webAddress } from '../../../../shared/forms/contact-validators';
import { RegistrationFormUrlField } from './registration-form-url-field';

function render(control: FormControl<string>) {
  const fixture = TestBed.createComponent(RegistrationFormUrlField);
  fixture.componentRef.setInput('control', control);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('RegistrationFormUrlField', () => {
  it('labels the required link box and edits the control', () => {
    const control = new FormControl('https://docs.google.com/forms', { nonNullable: true });
    const { element } = render(control);
    const label = element.querySelector('label') as HTMLLabelElement;
    const input = element.querySelector('input') as HTMLInputElement;

    expect(label.textContent).toContain('رابط نموذج التسجيل الخارجي');
    expect(label.querySelector('span')?.textContent).toBe('*');
    expect(label.htmlFor).toBe(input.id);
    expect(input.type).toBe('url');
    expect(input.value).toBe('https://docs.google.com/forms');

    input.value = 'https://forms.app/join';
    input.dispatchEvent(new Event('input'));
    expect(control.value).toBe('https://forms.app/join');
  });

  it('writes the link left to right, still against the right edge as drawn', () => {
    const input = render(new FormControl('', { nonNullable: true })).element.querySelector(
      'input',
    ) as HTMLInputElement;

    expect(input.getAttribute('dir')).toBe('ltr');
    expect(input.classList).toContain('text-right');
  });

  it('asks for a full address once touched', () => {
    const control = new FormControl('docs.google.com', {
      nonNullable: true,
      validators: [Validators.required, webAddress],
    });
    const { fixture, element } = render(control);

    control.markAsTouched();
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'أدخل رابطاً كاملاً يبدأ بـ https://\u200E',
    );
    expect(element.querySelector('input')?.getAttribute('aria-invalid')).toBe('true');
  });
});
