import { TestBed } from '@angular/core/testing';
import { NO_REVIEW_FILTERS, ReviewFilters } from '../../models/review-filters';
import { ReviewFilterPanel } from './review-filter-panel';

function render(filters: ReviewFilters = NO_REVIEW_FILTERS) {
  const fixture = TestBed.createComponent(ReviewFilterPanel);
  fixture.componentRef.setInput('filters', filters);
  fixture.detectChanges();
  return fixture;
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

function placeInput(element: HTMLElement): HTMLInputElement {
  return element.querySelector('input[aria-label="المتجر / المكان"]') as HTMLInputElement;
}

describe('ReviewFilterPanel', () => {
  it('shows the heading, the four groups and the footer actions', () => {
    const text = (render().nativeElement as HTMLElement).textContent;

    for (const words of [
      'تصفية التقييمات',
      'تطبيق معايير متعددة لتخصيص نتائج البحث',
      'التقييم',
      'الحالة',
      'المتجر / المكان',
      'الفترة الزمنية',
      'إعادة ضبط',
      'تطبيق الفلاتر',
    ]) {
      expect(text).toContain(words);
    }
  });

  it('applies only when asked, with everything picked in the panel', () => {
    const fixture = render();
    const applied = vi.fn();
    fixture.componentInstance.applied.subscribe(applied);
    const element = fixture.nativeElement as HTMLElement;

    buttonNamed(element, '4+ نجوم').click();
    buttonNamed(element, 'مُبلّغ عنه').click();
    placeInput(element).value = 'صيدلية الحياة';
    placeInput(element).dispatchEvent(new Event('input'));
    buttonNamed(element, 'آخر 7 أيام').click();
    fixture.detectChanges();
    expect(applied).not.toHaveBeenCalled();
    buttonNamed(element, 'تطبيق الفلاتر').click();

    expect(applied).toHaveBeenCalledWith({
      rating: 'fourStarsAndUp',
      status: 'reported',
      placeName: 'صيدلية الحياة',
      period: 'last7Days',
      customRange: { from: null, to: null },
    });
  });

  it('clears the place from its cross, which shows only while there is a place', () => {
    const fixture = render({ ...NO_REVIEW_FILTERS, placeName: 'صيدلية الحياة' });
    const element = fixture.nativeElement as HTMLElement;
    expect(placeInput(element).value).toBe('صيدلية الحياة');

    (element.querySelector('button[aria-label="مسح المكان"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(placeInput(element).value).toBe('');
    expect(element.querySelector('button[aria-label="مسح المكان"]')).toBeNull();
  });

  it('holds apply until a custom range is whole', () => {
    const fixture = render({ ...NO_REVIEW_FILTERS, period: 'custom' });
    const element = fixture.nativeElement as HTMLElement;

    expect(buttonNamed(element, 'تطبيق الفلاتر').disabled).toBe(true);
    const fields = element.querySelectorAll('app-date-field');
    expect(fields[0].classList).toContain('w-[114px]');
  });

  it('resets every group and applies that at once', () => {
    const fixture = render({ ...NO_REVIEW_FILTERS, rating: 'unrated', placeName: 'مقهى' });
    const applied = vi.fn();
    fixture.componentInstance.applied.subscribe(applied);
    const element = fixture.nativeElement as HTMLElement;

    buttonNamed(element, 'إعادة ضبط').click();
    fixture.detectChanges();

    expect(applied).toHaveBeenCalledWith(NO_REVIEW_FILTERS);
    expect(placeInput(element).value).toBe('');
  });

  it('closes from the cross', () => {
    const fixture = render();
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);

    (
      fixture.nativeElement.querySelector('button[aria-label="إغلاق"]') as HTMLButtonElement
    ).click();

    expect(closed).toHaveBeenCalledOnce();
  });
});
