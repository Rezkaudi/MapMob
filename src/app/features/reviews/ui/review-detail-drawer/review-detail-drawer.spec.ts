import { TestBed } from '@angular/core/testing';
import { ReviewDetail } from '../../models/review-detail';
import { buildReviewDetailView } from '../../state/review-detail-view';
import { buildReview, buildReviewDetail } from '../../testing/review-fixture';
import { ReviewDetailDrawer } from './review-detail-drawer';

interface RenderOptions {
  readonly detail?: ReviewDetail | null;
  readonly isLoading?: boolean;
  readonly error?: string | null;
}

function render(options: RenderOptions = {}) {
  const detail = options.detail === undefined ? buildReviewDetail() : options.detail;
  const fixture = TestBed.createComponent(ReviewDetailDrawer);
  fixture.componentRef.setInput('detail', detail);
  fixture.componentRef.setInput('view', detail ? buildReviewDetailView(detail) : null);
  fixture.componentRef.setInput('isLoading', options.isLoading ?? false);
  fixture.componentRef.setInput('error', options.error ?? null);
  fixture.detectChanges();
  return fixture;
}

describe('ReviewDetailDrawer', () => {
  it('shows the place, the reviewer, the review and the report of a reported review', () => {
    const element = render().nativeElement as HTMLElement;
    const text = element.textContent ?? '';

    for (const words of [
      'تفاصيل المراجعة والبلاغ',
      'الشركة المستهدفة بالتقييم',
      'صيدلية الشفاء',
      'صيدلية · طرطوس،طرطوس المدينة',
      'ID: #4920',
      'معلومات العميل (صاحب التقييم)',
      'سارة محمد',
      'س م',
      'عضو موثق منذ يناير 2024 · 14 تقييم',
      'حساب موثق برقم الجوال',
      'نص التقييم المقدم',
      '(2.0)',
      '"الخدمة كانت بطيئة ولم أجد بعض الأدوية الأساسية في الصيدلية."',
      'تاريخ الإرسال:',
      'بيانات البلاغ الوارد',
      'قيد المراجعة',
      'مقدم البلاغ:',
      'إدارة صيدلية الشفاء',
      'سبب البلاغ:',
      'معلومات غير صحيحة وإساءة',
      'ملاحظات مقدم البلاغ:',
      '"العميلة لم تقم بزيارة الفرع والأدوية المذكورة متوفرة دائماً."',
      'قبول وإخفاء التقييم',
    ]) {
      expect(text).toContain(words);
    }
    expect(element.querySelector('[data-role="alert-dot"]')).toBeTruthy();
    expect(element.querySelector('app-star-rating')).toBeTruthy();
  });

  it('keeps the decisions in the fixed footer, not in the scrolling body', () => {
    const element = render().nativeElement as HTMLElement;

    expect(element.querySelector('footer app-review-moderation-actions')).toBeTruthy();
  });

  it('leaves out the report, the dot, the stars and the verified badge when they do not apply', () => {
    const detail = buildReviewDetail({
      review: buildReview({ rating: null, status: 'published' }),
      reviewer: { ...buildReviewDetail().reviewer, isPhoneVerified: false },
      report: null,
    });
    const element = render({ detail }).nativeElement as HTMLElement;

    expect(element.textContent).toContain('تفاصيل المراجعة');
    expect(element.textContent).not.toContain('بيانات البلاغ الوارد');
    expect(element.textContent).not.toContain('حساب موثق برقم الجوال');
    expect(element.querySelector('[data-role="alert-dot"]')).toBeNull();
    expect(element.querySelector('app-star-rating')).toBeNull();
    expect(element.textContent).toContain('إخفاء التقييم');
  });

  it('passes each decision on for the open review', () => {
    const fixture = render();
    const acceptReport = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.acceptReport.subscribe(acceptReport);
    fixture.componentInstance.remove.subscribe(remove);
    const buttons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button'));

    buttons.find((button) => button.textContent?.trim() === 'قبول وإخفاء التقييم')?.click();
    buttons
      .find((button) => button.textContent?.trim() === 'حذف التقييم نهائياً من المنصة')
      ?.click();

    expect(acceptReport).toHaveBeenCalledWith(buildReviewDetail().review);
    expect(remove).toHaveBeenCalledWith(buildReviewDetail().review);
  });

  it('draws placeholders while loading, and a retry when the load failed', () => {
    const loading = render({ detail: null, isLoading: true });
    expect(loading.nativeElement.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);

    const failed = render({ detail: null, error: 'تعذر التحميل' });
    const retry = vi.fn();
    failed.componentInstance.retry.subscribe(retry);
    failed.nativeElement.querySelector('app-error-state button').click();
    expect(retry).toHaveBeenCalledOnce();
  });

  it('closes on request', () => {
    const fixture = render();
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);

    (
      fixture.nativeElement.querySelector('button[aria-label="إغلاق"]') as HTMLButtonElement
    ).click();

    expect(closed).toHaveBeenCalledOnce();
  });
});
