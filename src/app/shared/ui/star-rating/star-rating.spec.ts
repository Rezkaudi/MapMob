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

  it('draws the amber stars of the merchant reviews at any size and gap, filled from the right', () => {
    const fixture = TestBed.createComponent(StarRating);
    fixture.componentRef.setInput('rating', 1);
    fixture.componentRef.setInput('starStyle', 'amber');
    fixture.componentRef.setInput('size', 16);
    fixture.componentRef.setInput('gap', 6);
    fixture.componentRef.setInput('fillDirection', 'rtl');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    const row = element.querySelector('[role="img"]') as HTMLElement;
    const stars = Array.from(element.querySelectorAll('app-icon'));
    const glyph = element.querySelector('app-icon span') as HTMLElement;
    expect(row.getAttribute('dir')).toBe('rtl');
    expect(row.style.gap).toBe('6px');
    expect(glyph.style.maskImage).toContain('assets/icons/star-solid.svg');
    expect(glyph.style.width).toBe('16px');
    expect(stars[0].classList).toContain('text-[#fbbf24]');
    expect(stars.filter((star) => star.classList.contains('text-[#e2e8f0]'))).toHaveLength(4);
  });
});
