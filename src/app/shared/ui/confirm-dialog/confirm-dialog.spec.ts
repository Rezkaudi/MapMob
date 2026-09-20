import { TestBed } from '@angular/core/testing';
import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog', () => {
  it('renders the title, message, note and confirm label', () => {
    const fixture = TestBed.createComponent(ConfirmDialog);
    fixture.componentRef.setInput('title', 'تفعيل الشركات');
    fixture.componentRef.setInput('message', 'هل أنت متأكد من تفعيل الشركات المحددة؟');
    fixture.componentRef.setInput('note', 'تم تحديد 5 شركات');
    fixture.componentRef.setInput('confirmLabel', 'تفعيل الشركات');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('تفعيل الشركات');
    expect(text).toContain('هل أنت متأكد من تفعيل الشركات المحددة؟');
    expect(text).toContain('تم تحديد 5 شركات');
  });

  it('emits confirmed and cancelled', () => {
    const fixture = TestBed.createComponent(ConfirmDialog);
    fixture.componentRef.setInput('title', 'حذف');
    fixture.componentRef.setInput('message', 'متأكد؟');
    fixture.componentRef.setInput('confirmLabel', 'حذف');
    const fired: string[] = [];
    fixture.componentInstance.confirmed.subscribe(() => fired.push('confirmed'));
    fixture.componentInstance.cancelled.subscribe(() => fired.push('cancelled'));
    fixture.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );
    buttons.find((button) => button.textContent?.includes('حذف'))?.click();
    buttons.find((button) => button.textContent?.includes('إلغاء'))?.click();

    expect(fired).toEqual(['confirmed', 'cancelled']);
  });

  it('shows the final-action warning when one is given', () => {
    const fixture = TestBed.createComponent(ConfirmDialog);
    fixture.componentRef.setInput('title', 'حذف الشركات');
    fixture.componentRef.setInput('message', 'هل أنت متأكد؟');
    fixture.componentRef.setInput('confirmLabel', 'حذف الشركات');
    fixture.componentRef.setInput('warning', 'تنبيه: إجراء نهائي لا يمكن التراجع عنه');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('تنبيه: إجراء نهائي لا يمكن التراجع عنه');
  });

  it('paints each tone with its own icon and colours', () => {
    const tones = [
      { tone: 'success', icon: 'check-circle', accent: 'bg-status-success' },
      { tone: 'warning', icon: 'pause-circle', accent: 'bg-accent' },
      { tone: 'danger', icon: 'close', accent: 'bg-status-error' },
    ] as const;

    for (const { tone, icon, accent } of tones) {
      const fixture = TestBed.createComponent(ConfirmDialog);
      fixture.componentRef.setInput('title', 'عنوان');
      fixture.componentRef.setInput('message', 'رسالة');
      fixture.componentRef.setInput('confirmLabel', 'تأكيد');
      fixture.componentRef.setInput('tone', tone);
      fixture.detectChanges();

      const glyph: HTMLElement = fixture.nativeElement.querySelector('app-icon span');
      expect(glyph.style.maskImage).toContain(`${icon}.svg`);

      const confirm: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(confirm.className).toContain(accent);
    }
  });
});

describe('ConfirmDialog while saving', () => {
  it('blocks a second confirm until the save is done', () => {
    const fixture = TestBed.createComponent(ConfirmDialog);
    fixture.componentRef.setInput('title', 'حذف الشركات');
    fixture.componentRef.setInput('message', 'متأكد؟');
    fixture.componentRef.setInput('confirmLabel', 'حذف الشركات');
    fixture.componentRef.setInput('isBusy', true);
    fixture.detectChanges();

    const confirm: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(confirm.disabled).toBe(true);
  });
});
