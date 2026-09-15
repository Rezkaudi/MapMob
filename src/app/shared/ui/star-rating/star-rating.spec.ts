import { TestBed } from '@angular/core/testing';
import { StarRating } from './star-rating';

describe('StarRating', () => {
  it('fills as many of the five stars as the rating and says the rating aloud', () => {
    const fixture = TestBed.createComponent(StarRating);
    fixture.componentRef.setInput('rating', 4);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    const stars = Array.from(element.querySelectorAll('app-icon'));
    expect(stars).toHaveLength(5);
    expect(stars.filter((star) => star.classList.contains('text-[#fea619]'))).toHaveLength(4);
    expect(element.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('4 من 5 نجوم');
  });

  it('draws the small rounded stars of the review drawer when asked', () => {
    const fixture = TestBed.createComponent(StarRating);
    fixture.componentRef.setInput('rating', 2);
    fixture.componentRef.setInput('starStyle', 'rounded');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    const stars = Array.from(element.querySelectorAll('app-icon'));
    const glyph = element.querySelector('app-icon span') as HTMLElement;
    expect(glyph.style.maskImage).toContain('assets/icons/star-solid.svg');
    expect(glyph.style.width).toBe('12px');
    expect(stars.filter((star) => star.classList.contains('text-accent'))).toHaveLength(2);
    expect(stars.filter((star) => star.classList.contains('text-border'))).toHaveLength(3);
  });
});
