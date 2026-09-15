import { TestBed } from '@angular/core/testing';
import { ReviewModeration } from '../../state/review-detail-view';
import { ReviewModerationActions } from './review-moderation-actions';

function render(moderation: ReviewModeration, isBusy = false) {
  const fixture = TestBed.createComponent(ReviewModerationActions);
  fixture.componentRef.setInput('moderation', moderation);
  fixture.componentRef.setInput('isBusy', isBusy);
  fixture.detectChanges();
  return fixture;
}

function labelsOf(element: HTMLElement): string[] {
  return Array.from(
    element.querySelectorAll('button'),
    (button) => button.textContent?.trim() ?? '',
  );
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('ReviewModerationActions', () => {
  it('settles a report by rejecting or accepting it, and deletes for good', () => {
    const fixture = render('settleReport');
    const element = fixture.nativeElement as HTMLElement;
    const rejectReport = vi.fn();
    const acceptReport = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.rejectReport.subscribe(rejectReport);
    fixture.componentInstance.acceptReport.subscribe(acceptReport);
    fixture.componentInstance.remove.subscribe(remove);

    expect(element.textContent).toContain('اتخاذ إجراء كمشرف:');
    expect(labelsOf(element)).toEqual([
      'رفض البلاغ (إبقاء التقييم)',
      'قبول وإخفاء التقييم',
      'حذف التقييم نهائياً من المنصة',
    ]);
    buttonNamed(element, 'رفض البلاغ (إبقاء التقييم)').click();
    buttonNamed(element, 'قبول وإخفاء التقييم').click();
    buttonNamed(element, 'حذف التقييم نهائياً من المنصة').click();

    expect(rejectReport).toHaveBeenCalledOnce();
    expect(acceptReport).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledOnce();
  });

  it('hides a published review and shows a hidden one', () => {
    const published = render('hide');
    const hidden = render('show');
    const publishedChange = vi.fn();
    const hiddenChange = vi.fn();
    published.componentInstance.statusChange.subscribe(publishedChange);
    hidden.componentInstance.statusChange.subscribe(hiddenChange);

    buttonNamed(published.nativeElement, 'إخفاء التقييم').click();
    buttonNamed(hidden.nativeElement, 'إظهار التقييم').click();

    expect(publishedChange).toHaveBeenCalledWith('hidden');
    expect(hiddenChange).toHaveBeenCalledWith('published');
  });

  it('holds every button while a decision is saving', () => {
    const buttons = Array.from(
      (render('settleReport', true).nativeElement as HTMLElement).querySelectorAll('button'),
    );

    expect(buttons.every((button) => button.disabled)).toBe(true);
  });
});
