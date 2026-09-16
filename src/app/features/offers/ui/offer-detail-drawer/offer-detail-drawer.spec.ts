import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OfferDetail } from '../../models/offer-detail';
import { buildOfferDetailView } from '../../state/offer-detail-view';
import { buildOffer, buildOfferDetail } from '../../testing/offer-fixture';
import { OfferDetailDrawer } from './offer-detail-drawer';

const DETAIL = buildOfferDetail();

interface RenderOptions {
  readonly detail?: OfferDetail | null;
  readonly isLoading?: boolean;
  readonly error?: string | null;
}

function render(options: RenderOptions = {}) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(OfferDetailDrawer);
  const detail = options.detail === undefined ? DETAIL : options.detail;
  fixture.componentRef.setInput('detail', detail);
  fixture.componentRef.setInput('view', detail ? buildOfferDetailView(detail) : null);
  fixture.componentRef.setInput('isLoading', options.isLoading ?? false);
  fixture.componentRef.setInput('error', options.error ?? null);
  fixture.detectChanges();
  return fixture;
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('OfferDetailDrawer', () => {
  it('shows the offer, the store that published it and its days', () => {
    const element = render().nativeElement as HTMLElement;
    const text = element.textContent ?? '';

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('تفاصيل العرض');
    for (const words of [
      'خصم 30% على جميع الأزياء الشتوية',
      'احصل على خصم فوري بنسبة 30 % على كامل تشكيلة الشتاء لعام 2026.',
      'المتجر الناشر للعرض',
      'ألبسة الجمال',
      'ألبسة',
      'طرطوس،طرطوس المدينة، شارع الثورة',
      'مدة وصلاحية العرض',
      'تاريخ البداية',
      '01 سبتمبر 2026',
      'تاريخ الانتهاء',
      '15 سبتمبر 2026',
    ]) {
      expect(text).toContain(words);
    }
    expect(element.querySelector('[data-role="place-initial"]')?.textContent?.trim()).toBe('ج');
  });

  it('links to the store page', () => {
    const link = (render().nativeElement as HTMLElement).querySelector(
      'a[data-role="place-link"]',
    ) as HTMLAnchorElement;

    expect(link.textContent?.trim()).toBe('عرض تفاصيل المتجر');
    expect(link.getAttribute('href')).toBe('/places/place-7');
  });

  it('sends edit, pause and delete for the open offer from the footer', () => {
    const fixture = render();
    const edit = vi.fn();
    const pause = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.edit.subscribe(edit);
    fixture.componentInstance.pause.subscribe(pause);
    fixture.componentInstance.remove.subscribe(remove);
    const footer = (fixture.nativeElement as HTMLElement).querySelector('footer') as HTMLElement;

    expect(
      Array.from(footer.querySelectorAll('button'), (button) => button.textContent?.trim()),
    ).toEqual(['تعديل العرض', 'إيقاف العرض', 'حذف']);
    buttonNamed(footer, 'تعديل العرض').click();
    buttonNamed(footer, 'إيقاف العرض').click();
    buttonNamed(footer, 'حذف').click();

    expect(edit).toHaveBeenCalledWith(DETAIL.offer);
    expect(pause).toHaveBeenCalledWith(DETAIL.offer);
    expect(remove).toHaveBeenCalledWith(DETAIL.offer);
  });

  it('offers to resume a paused offer instead', () => {
    const paused = buildOfferDetail({ offer: buildOffer({ id: 'offer-5', status: 'paused' }) });
    const fixture = render({ detail: paused });
    const resume = vi.fn();
    fixture.componentInstance.resume.subscribe(resume);
    const element = fixture.nativeElement as HTMLElement;

    expect(buttonNamed(element, 'إيقاف العرض')).toBeUndefined();
    buttonNamed(element, 'تفعيل العرض').click();

    expect(resume).toHaveBeenCalledWith(paused.offer);
  });

  it('shows placeholders while loading and the error with a retry', () => {
    const loading = render({ detail: null, isLoading: true }).nativeElement as HTMLElement;
    expect(loading.querySelector('[aria-busy="true"]')).toBeTruthy();
    expect(loading.querySelector('footer button')).toBeNull();

    TestBed.resetTestingModule();
    const failed = render({ detail: null, error: 'تعذر تحميل العرض' });
    const retry = vi.fn();
    failed.componentInstance.retry.subscribe(retry);
    expect(failed.nativeElement.textContent).toContain('تعذر تحميل العرض');
    (failed.nativeElement.querySelector('[role="alert"] button') as HTMLButtonElement).click();
    expect(retry).toHaveBeenCalled();
  });
});
