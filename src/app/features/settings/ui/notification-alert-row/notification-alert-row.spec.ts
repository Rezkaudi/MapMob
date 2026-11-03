import { TestBed } from '@angular/core/testing';
import { NotificationAlert } from '../../models/notification-alert';
import { NotificationAlertRow } from './notification-alert-row';

function render(alert: NotificationAlert) {
  const fixture = TestBed.createComponent(NotificationAlertRow);
  fixture.componentRef.setInput('alert', alert);
  const toggles: boolean[] = [];
  fixture.componentInstance.toggled.subscribe((isEnabled) => toggles.push(isEnabled));
  fixture.detectChanges();
  return { element: fixture.nativeElement as HTMLElement, toggles };
}

describe('NotificationAlertRow', () => {
  it('describes the alert beside its tinted icon', () => {
    const { element } = render({ kind: 'subscription-expiring', isEnabled: true });

    expect(element.querySelector('[data-role="alert-title"]')?.textContent?.trim()).toBe(
      'اشتراك تجاري على وشك الانتهاء',
    );
    expect(element.querySelector('[data-role="alert-description"]')?.textContent?.trim()).toBe(
      'تنبيه قبل 7 أيام من انتهاء خطة الاشتراك للمتجر للتذكير والتجديد',
    );
    expect(element.querySelector('[data-role="alert-icon"]')?.classList).toContain(
      'text-text-secondary',
    );
  });

  it('names the switch after the alert and reports the new state', () => {
    const { element, toggles } = render({ kind: 'new-payment', isEnabled: false });
    const toggle = element.querySelector('button[role="switch"]') as HTMLButtonElement;

    expect(toggle.getAttribute('aria-label')).toBe('عملية دفع جديدة');
    expect(toggle.getAttribute('aria-checked')).toBe('false');
    toggle.click();

    expect(toggles).toEqual([true]);
  });
});

describe('NotificationAlertRow while saving', () => {
  it('spins beside the switch of the alert being saved', () => {
    const fixture = TestBed.createComponent(NotificationAlertRow);
    fixture.componentRef.setInput('alert', { kind: 'subscription-expiring', isEnabled: true });
    fixture.componentRef.setInput('isSaving', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-spinner')).not.toBeNull();
  });

  it('holds the switch while any alert is saving', () => {
    const fixture = TestBed.createComponent(NotificationAlertRow);
    fixture.componentRef.setInput('alert', { kind: 'subscription-expiring', isEnabled: true });
    fixture.componentRef.setInput('isDisabled', true);
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector(
      'button[role="switch"], button',
    ) as HTMLButtonElement;
    expect(toggle.disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('app-spinner')).toBeNull();
  });
});
