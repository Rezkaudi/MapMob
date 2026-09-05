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
});
