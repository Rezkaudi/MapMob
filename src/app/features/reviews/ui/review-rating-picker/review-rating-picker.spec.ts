import { TestBed } from '@angular/core/testing';
import { ReviewRatingFilter } from '../../models/review-rating-filter';
import { ReviewRatingPicker } from './review-rating-picker';

function render(selected: ReviewRatingFilter | null) {
  const fixture = TestBed.createComponent(ReviewRatingPicker);
  fixture.componentRef.setInput('selected', selected);
  fixture.detectChanges();
  return fixture;
}

function radios(element: HTMLElement): HTMLButtonElement[] {
  return Array.from(element.querySelectorAll('[role="radio"]'));
}

describe('ReviewRatingPicker', () => {
  it('lays out "الكل" then the star choices in the design order, stars beside the counted ones', () => {
    const element = render(null).nativeElement as HTMLElement;

    expect(radios(element).map((radio) => radio.textContent?.trim())).toEqual([
      'الكل',
      '5+ نجوم',
      '4+ نجوم',
      '3 نجوم',
      'نجمتين',
      'نجمة',
      'بدون',
    ]);
    const starred = radios(element).map((radio) => !!radio.querySelector('app-icon'));
    expect(starred).toEqual([false, true, true, true, true, true, false]);
    expect(element.querySelector('[role="radiogroup"]')?.getAttribute('aria-label')).toBe(
      'التقييم',
    );
  });

  it('marks the picked choice in blue and reports a new pick', () => {
    const fixture = render('fourStarsAndUp');
    const selectedChange = vi.fn();
    fixture.componentInstance.selectedChange.subscribe(selectedChange);
    const [all, , fourAndUp] = radios(fixture.nativeElement);

    expect(fourAndUp.getAttribute('aria-checked')).toBe('true');
    expect(fourAndUp.classList).toContain('bg-primary');
    expect(all.getAttribute('aria-checked')).toBe('false');
    all.click();

    expect(selectedChange).toHaveBeenCalledWith(null);
  });
});
