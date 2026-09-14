import { TestBed } from '@angular/core/testing';
import { buildConfirmCopy } from '../region-dialog-copy';
import { RegionConfirmDialog } from './region-confirm-dialog';

function render(action: 'activate' | 'suspend', isBusy = false) {
  const fixture = TestBed.createComponent(RegionConfirmDialog);
  fixture.componentRef.setInput('copy', buildConfirmCopy('governorate', action, 'طرطوس'));
  fixture.componentRef.setInput('isBusy', isBusy);
  fixture.detectChanges();
  return fixture;
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('RegionConfirmDialog', () => {
  it('shows the title, both lines of the message and the actions', () => {
    const element = render('activate').nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('تفعيل المحافظة');
    expect(element.textContent).toContain('هل تريد تفعيل محافظة طرطوس؟');
    expect(element.textContent).toContain('ستصبح متاحة للاستخدام عند إضافة أماكن جديدة.');
    expect(buttonNamed(element, 'تفعيل المحافظة').className).toContain('bg-status-success');
    expect(buttonNamed(element, 'إلغاء')).toBeTruthy();
  });

  it('paints a suspend request red', () => {
    const element = render('suspend').nativeElement as HTMLElement;

    expect(buttonNamed(element, 'تعطيل المحافظة').className).toContain('bg-closed');
  });

  it('reports confirm, cancel, a click on the backdrop and the Escape key', () => {
    const fixture = render('activate');
    const confirmed = vi.fn();
    const cancelled = vi.fn();
    fixture.componentInstance.confirmed.subscribe(confirmed);
    fixture.componentInstance.cancelled.subscribe(cancelled);
    const element = fixture.nativeElement as HTMLElement;

    buttonNamed(element, 'تفعيل المحافظة').click();
    buttonNamed(element, 'إلغاء').click();
    (element.querySelector('[role="dialog"]') as HTMLElement).click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(confirmed).toHaveBeenCalledOnce();
    expect(cancelled).toHaveBeenCalledTimes(3);
  });

  it('locks the confirm button while the request runs', () => {
    const element = render('activate', true).nativeElement as HTMLElement;

    expect(buttonNamed(element, 'تفعيل المحافظة').disabled).toBe(true);
  });
});
