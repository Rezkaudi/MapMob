import { TestBed } from '@angular/core/testing';
import { ReviewStatus } from '../../models/review-status';
import { ReviewStatusPicker } from './review-status-picker';

function render(selected: ReviewStatus | null) {
  const fixture = TestBed.createComponent(ReviewStatusPicker);
  fixture.componentRef.setInput('selected', selected);
  fixture.detectChanges();
  return fixture;
}

function radios(element: HTMLElement): HTMLButtonElement[] {
  return Array.from(element.querySelectorAll('[role="radio"]'));
}

describe('ReviewStatusPicker', () => {
  it('offers "الكل" and the three statuses, worded as the filter design writes them', () => {
    expect(radios(render(null).nativeElement).map((radio) => radio.textContent?.trim())).toEqual([
      'الكل',
      'منشور',
      'مُبلّغ عنه',
      'مخفي',
    ]);
  });

  it('fills the picked "reported" choice in red and reports a new pick', () => {
    const fixture = render('reported');
    const selectedChange = vi.fn();
    fixture.componentInstance.selectedChange.subscribe(selectedChange);
    const [, published, reported] = radios(fixture.nativeElement);

    expect(reported.getAttribute('aria-checked')).toBe('true');
    expect(reported.classList).toContain('bg-status-error');
    published.click();

    expect(selectedChange).toHaveBeenCalledWith('published');
  });
});
