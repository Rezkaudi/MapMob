import { TestBed } from '@angular/core/testing';
import { ReviewReport } from '../../models/review-report';
import { buildOwnerReview } from '../../testing/owner-review-fixture';
import { ReviewReportDialog } from './review-report-dialog';

const TAREQ = buildOwnerReview({ author: { id: 'user-5', name: 'طارق السعيد' }, rating: 1 });

function build() {
  const fixture = TestBed.createComponent(ReviewReportDialog);
  fixture.componentRef.setInput('review', TAREQ);
  fixture.detectChanges();
  const submitted: ReviewReport[] = [];
  fixture.componentInstance.submitted.subscribe((report) => submitted.push(report));
  return { fixture, element: fixture.nativeElement as HTMLElement, submitted };
}

function sendButton(element: HTMLElement): HTMLButtonElement {
  return Array.from(element.querySelectorAll<HTMLButtonElement>('footer button')).find(
    (button) => button.textContent?.trim() === 'إرسال البلاغ',
  )!;
}

function pickReason(element: HTMLElement, index: number): void {
  element.querySelectorAll<HTMLInputElement>('input[type="radio"]')[index].click();
}

describe('ReviewReportDialog', () => {
  it('shows the review being reported and the five reasons', () => {
    const { element } = build();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('الإبلاغ عن مراجعة');
    expect(element.querySelector('[data-role="author"]')?.textContent?.trim()).toBe('طارق السعيد');
    expect(element.querySelector('[data-role="comment"]')?.textContent).toContain(TAREQ.comment);
    expect(
      Array.from(element.querySelectorAll('label[data-role="reason"]')).map((reason) =>
        reason.textContent?.trim(),
      ),
    ).toEqual([
      'المراجعة تحتوي على إساءة أو ألفاظ نابية',
      'المراجعة غير صحيحة أو تجربة وهمية لم تحدث',
      'المراجعة لا تتعلق بالمكان أو تخص متجر آخر',
      'محتوى ترويجي أو روابط مضللة',
      'سبب آخر',
    ]);
  });

  it('waits for a reason before it can be sent', () => {
    const { fixture, element } = build();

    expect(sendButton(element).disabled).toBe(true);
    pickReason(element, 1);
    fixture.detectChanges();

    expect(sendButton(element).disabled).toBe(false);
  });

  it('sends the reason with the trimmed details, or null when there are none', () => {
    const { fixture, element, submitted } = build();
    const notes = element.querySelector<HTMLTextAreaElement>('textarea')!;

    pickReason(element, 0);
    fixture.detectChanges();
    sendButton(element).click();
    notes.value = '  لم يزر المتجر  ';
    notes.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    sendButton(element).click();

    expect(submitted).toEqual([
      { reason: 'abusive', notes: null },
      { reason: 'abusive', notes: 'لم يزر المتجر' },
    ]);
  });

  it('counts the details against their 500-letter limit', () => {
    const { fixture, element } = build();
    const notes = element.querySelector<HTMLTextAreaElement>('textarea')!;

    notes.value = 'نص';
    notes.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(notes.maxLength).toBe(500);
    expect(element.querySelector('[data-role="notes-count"]')?.textContent?.trim()).toBe(
      'الحد الأقصى 500 حرف • (500/2)',
    );
  });

  it('holds the buttons while the report is on its way', () => {
    const { fixture, element } = build();
    pickReason(element, 0);
    fixture.componentRef.setInput('isBusy', true);
    fixture.detectChanges();

    expect(sendButton(element).disabled).toBe(true);
  });
});
