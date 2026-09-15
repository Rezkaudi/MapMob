import { TestBed } from '@angular/core/testing';
import { UserReviewList } from './user-review-list';

const ROWS = [
  {
    id: 'r1',
    placeName: 'مطعم النخيل',
    metaLabel: 'تصنيف: مطاعم · حي النخيل، الرياض',
    comment: '"الخدمة ممتازة"',
    dateLabel: 'تاريخ التقييم: 02 سبتمبر 2026',
    rating: 5,
  },
];

function render(rows: unknown[]) {
  const fixture = TestBed.createComponent(UserReviewList);
  fixture.componentRef.setInput('rows', rows);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('UserReviewList', () => {
  it('shows the place, the stars, the comment and the date', () => {
    const card = render(ROWS).querySelector('article') as HTMLElement;

    expect(card.querySelector('h3')?.textContent?.trim()).toBe('مطعم النخيل');
    expect(card.textContent).toContain('تصنيف: مطاعم · حي النخيل، الرياض');
    expect(card.textContent).toContain('"الخدمة ممتازة"');
    expect(card.textContent).toContain('تاريخ التقييم: 02 سبتمبر 2026');
    expect(card.querySelector('app-star-rating')).toBeTruthy();
  });

  it('says so when there are no reviews', () => {
    expect(render([]).textContent).toContain('لم يضف المستخدم أي تقييم بعد');
  });
});
