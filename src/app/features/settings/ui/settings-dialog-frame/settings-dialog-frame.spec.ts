import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SettingsDialogFrame } from './settings-dialog-frame';

@Component({
  imports: [SettingsDialogFrame],
  template: `
    <form (submit)="submits = submits + 1; $event.preventDefault()">
      <app-settings-dialog-frame
        title="إضافة مشرف جديد"
        description="أدخل بيانات المشرف"
        icon="settings-user"
        submitLabel="إضافة المشرف"
        [isBusy]="isBusy()"
        [saveError]="saveError()"
        (closed)="closes = closes + 1"
      >
        <input id="projected-field" />
      </app-settings-dialog-frame>
    </form>
  `,
})
class Host {
  submits = 0;
  closes = 0;
  readonly isBusy = signal(false);
  readonly saveError = signal<string | null>(null);
}

function render() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  return {
    fixture,
    element: fixture.nativeElement as HTMLElement,
    host: fixture.componentInstance,
  };
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('SettingsDialogFrame', () => {
  it('is a labelled modal with the title, description and the projected fields', () => {
    const { element } = render();
    const dialog = element.querySelector('[role="dialog"]') as HTMLElement;

    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(
      element.querySelector(`#${dialog.getAttribute('aria-labelledby')}`)?.textContent?.trim(),
    ).toBe('إضافة مشرف جديد');
    expect(element.textContent).toContain('أدخل بيانات المشرف');
    expect(element.querySelector('#projected-field')).toBeTruthy();
  });

  it('submits the surrounding form from the main button', () => {
    const { element, host } = render();

    buttonNamed(element, 'إضافة المشرف').click();

    expect(host.submits).toBe(1);
  });

  it('closes from the cross, the cancel button and the Escape key', () => {
    const { element, host } = render();

    (element.querySelector('button[aria-label="إغلاق النافذة"]') as HTMLButtonElement).click();
    buttonNamed(element, 'إلغاء').click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(host.closes).toBe(3);
    expect(host.submits).toBe(0);
  });

  it('disables the main button while busy and shows a save error', () => {
    const { fixture, element, host } = render();

    host.isBusy.set(true);
    host.saveError.set('البريد مستخدم من قبل');
    fixture.detectChanges();

    expect(buttonNamed(element, 'إضافة المشرف').disabled).toBe(true);
    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'البريد مستخدم من قبل',
    );
  });
});
