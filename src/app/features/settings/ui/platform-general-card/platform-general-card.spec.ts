import { TestBed } from '@angular/core/testing';
import { PlatformGeneralDraft } from '../../models/platform-general-draft';
import { buildPlatformSettings } from '../../testing/settings-fixture';
import { PlatformGeneralCard } from './platform-general-card';

function render() {
  const fixture = TestBed.createComponent(PlatformGeneralCard);
  fixture.componentRef.setInput('general', buildPlatformSettings().general);
  const saved: PlatformGeneralDraft[] = [];
  fixture.componentInstance.saved.subscribe((draft) => saved.push(draft));
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, saved };
}

function input(element: HTMLElement, id: string): HTMLInputElement {
  return element.querySelector(`#${id}`) as HTMLInputElement;
}

describe('PlatformGeneralCard', () => {
  it('shows the basic information, with the logo file name', () => {
    const { element } = render();

    expect(element.querySelector('h3')?.textContent?.trim()).toBe('معلومات المنصة الأساسية');
    expect(input(element, 'platform-app-name').value).toBe('MapMob');
    expect(input(element, 'platform-support-email').value).toBe('supportmapmob@gmail.com');
    expect(input(element, 'platform-support-phone').value).toBe('+9639456788');
    expect(element.querySelector('[data-role="logo-file-name"]')?.textContent?.trim()).toBe(
      'MapMob_logo.svg',
    );
  });

  it('shows the name of a newly picked logo and sends the file with the save', () => {
    const { fixture, element, saved } = render();
    const logo = new File(['<svg/>'], 'new-logo.svg', { type: 'image/svg+xml' });
    const picker = input(element, 'platform-logo');
    Object.defineProperty(picker, 'files', { value: [logo] });

    picker.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    (element.querySelector('button[type="submit"]') as HTMLButtonElement).click();

    expect(element.querySelector('[data-role="logo-file-name"]')?.textContent?.trim()).toBe(
      'new-logo.svg',
    );
    expect(saved).toEqual([
      {
        appName: 'MapMob',
        supportEmail: 'supportmapmob@gmail.com',
        supportPhone: '+9639456788',
        logo,
      },
    ]);
  });

  it('does not save a bad email, and says why', () => {
    const { fixture, element, saved } = render();
    const email = input(element, 'platform-support-email');

    email.value = 'support@';
    email.dispatchEvent(new Event('input'));
    (element.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(saved).toEqual([]);
    expect(element.textContent).toContain('اكتب بريداً إلكترونياً صحيحاً');
  });
});
