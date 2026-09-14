import { TestBed } from '@angular/core/testing';
import { ConfirmActionCopy } from './confirm-action-copy';
import { ConfirmActionDialog } from './confirm-action-dialog';

const ACTIVATE_COPY: ConfirmActionCopy = {
  title: 'تفعيل المحافظة',
  question: 'هل تريد تفعيل محافظة طرطوس؟',
  detail: 'ستصبح متاحة للاستخدام عند إضافة أماكن جديدة.',
  confirmLabel: 'تفعيل المحافظة',
  tone: 'success',
};

const SUSPEND_COPY: ConfirmActionCopy = {
  title: 'تعطيل المحافظة',
  question: 'هل أنت متأكد من تعطيل محافظة طرطوس؟',
  detail: 'لن تظهر هذه المحافظة كخيار عند إضافة أماكن جديدة.',
  confirmLabel: 'تعطيل المحافظة',
  tone: 'danger',
};

function render(action: 'activate' | 'suspend', isBusy = false) {
  const fixture = TestBed.createComponent(ConfirmActionDialog);
  fixture.componentRef.setInput('copy', action === 'activate' ? ACTIVATE_COPY : SUSPEND_COPY);
  fixture.componentRef.setInput('isBusy', isBusy);
  fixture.detectChanges();
  return fixture;
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('ConfirmActionDialog', () => {
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
