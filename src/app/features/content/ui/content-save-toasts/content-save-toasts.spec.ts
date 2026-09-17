import { TestBed } from '@angular/core/testing';
import { ContentPageStatus } from '../../models/content-page-status';
import { ContentSaveToasts } from './content-save-toasts';

function render(savedStatus: ContentPageStatus | null, saveError: string | null) {
  const fixture = TestBed.createComponent(ContentSaveToasts);
  fixture.componentRef.setInput('savedStatus', savedStatus);
  fixture.componentRef.setInput('saveError', saveError);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('ContentSaveToasts', () => {
  it('confirms published changes', () => {
    const { element } = render('published', null);

    expect(element.textContent).toContain('تم حفظ التغييرات');
    expect(element.textContent).toContain('ستظهر التغييرات للمستخدمين داخل التطبيق.');
  });

  it('confirms a saved draft', () => {
    const { element } = render('draft', null);

    expect(element.textContent).toContain('تم حفظ المسودة');
  });

  it('shows why the save failed, and reports both dismissals', () => {
    const { fixture, element } = render(null, 'تعذر حفظ الصفحة');
    let errorDismissals = 0;
    fixture.componentInstance.errorDismissed.subscribe(() => (errorDismissals += 1));

    expect(element.textContent).toContain('تعذر حفظ الصفحة');
    (element.querySelector('[data-testid="toast-close"]') as HTMLButtonElement).click();

    expect(errorDismissals).toBe(1);
  });

  it('shows nothing when there is nothing to say', () => {
    expect(render(null, null).element.querySelector('app-toast')).toBeNull();
  });
});
