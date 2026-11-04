import { TestBed } from '@angular/core/testing';
import { ContentSaveToasts } from './content-save-toasts';

function render(isSaved: boolean, saveError: string | null) {
  const fixture = TestBed.createComponent(ContentSaveToasts);
  fixture.componentRef.setInput('isSaved', isSaved);
  fixture.componentRef.setInput('saveError', saveError);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('ContentSaveToasts', () => {
  it('confirms published changes', () => {
    const { element } = render(true, null);

    expect(element.textContent).toContain('تم حفظ التغييرات');
    expect(element.textContent).toContain('ستظهر التغييرات للمستخدمين داخل التطبيق.');
  });

  it('shows why the save failed, and reports both dismissals', () => {
    const { fixture, element } = render(false, 'تعذر حفظ الصفحة');
    let errorDismissals = 0;
    fixture.componentInstance.errorDismissed.subscribe(() => (errorDismissals += 1));

    expect(element.textContent).toContain('تعذر حفظ الصفحة');
    (element.querySelector('[data-testid="toast-close"]') as HTMLButtonElement).click();

    expect(errorDismissals).toBe(1);
  });

  it('shows nothing when there is nothing to say', () => {
    expect(render(false, null).element.querySelector('app-toast')).toBeNull();
  });
});
