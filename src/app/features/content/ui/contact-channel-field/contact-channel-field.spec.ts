import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { ContactChannelField } from './contact-channel-field';

function render(inputs: Record<string, unknown>) {
  const fixture = TestBed.createComponent(ContactChannelField);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('ContactChannelField', () => {
  it('draws a labelled phone box with its blue icon, typed left to right but kept on the right', () => {
    const control = new FormControl('+963 933 123 456', { nonNullable: true });
    const { element } = render({
      label: 'رقم الهاتف الرسمي',
      inputId: 'about-phone',
      control,
      type: 'tel',
      icon: 'contact-phone',
    });
    const input = element.querySelector('input') as HTMLInputElement;

    expect(element.querySelector('label')?.getAttribute('for')).toBe('about-phone');
    expect(element.querySelector('label')?.textContent?.trim()).toBe('رقم الهاتف الرسمي');
    expect(input.type).toBe('tel');
    expect(input.value).toBe('+963 933 123 456');
    expect(input.dir).toBe('ltr');
    expect(input.classList).toContain('text-right');
    expect(element.querySelector('app-icon')).toBeTruthy();
    expect(element.querySelector('[data-role="channel-box"]')?.classList).toContain('h-[60px]');
  });

  it('draws the compact social box with a coloured brand logo and left-aligned link', () => {
    const control = new FormControl('https://t.me/mapmobsupport', { nonNullable: true });
    const { element } = render({
      label: 'Telegram',
      inputId: 'contact-telegram',
      control,
      type: 'url',
      brandIcon: 'brand-telegram',
      size: 'compact',
      isRequired: true,
    });

    expect(element.querySelector('img')?.getAttribute('src')).toBe(
      'assets/icons/brand-telegram.svg',
    );
    expect(element.querySelector('input')?.classList).toContain('text-left');
    expect(element.querySelector('[data-role="channel-box"]')?.classList).toContain('h-[52px]');
    expect(element.querySelector('[data-role="channel-icon"]')?.classList).toContain('w-5');
    expect(element.querySelector('label [aria-hidden="true"]')?.textContent).toBe('*');
  });

  it('keeps Arabic text right to left', () => {
    const control = new FormControl('طرطوس', { nonNullable: true });
    const { element } = render({
      label: 'الموقع الجغرافي / المقر الرئيسي',
      inputId: 'about-address',
      control,
      icon: 'contact-pin',
      isLatin: false,
    });

    expect(element.querySelector('input')?.getAttribute('dir')).toBe('rtl');
  });

  it('shows the message once the field was visited and is still wrong', () => {
    const control = new FormControl('', { nonNullable: true, validators: Validators.required });
    control.markAsTouched();
    const { element } = render({
      label: 'البريد الإلكتروني',
      inputId: 'about-email',
      control,
      icon: 'contact-mail',
      errorMessage: 'اكتب بريداً إلكترونياً صحيحاً',
    });

    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'اكتب بريداً إلكترونياً صحيحاً',
    );
    expect(element.querySelector('input')?.getAttribute('aria-invalid')).toBe('true');
  });
});
