import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ComplaintDetailCard } from './complaint-detail-card';

@Component({
  imports: [ComplaintDetailCard],
  template: `
    <app-complaint-detail-card heading="بيانات المُبلّغ"><p>المحتوى</p></app-complaint-detail-card>
    <app-complaint-detail-card
      heading="المحتوى المُبلّغ عنه"
      headingWeight="regular"
      spacing="tight"
    />
  `,
})
class HostComponent {}

function renderCards(): HTMLElement[] {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('section'));
}

describe('ComplaintDetailCard', () => {
  it('titles the card and shows its content under the heading', () => {
    const [card] = renderCards();

    expect(card.querySelector('h2')?.textContent?.trim()).toBe('بيانات المُبلّغ');
    expect(card.querySelector('h2 + p')?.textContent).toBe('المحتوى');
    expect(card.getAttribute('aria-labelledby')).toBe(card.querySelector('h2')?.id);
  });

  it('draws a medium heading with 24px padding by default', () => {
    const [card] = renderCards();

    expect(card.querySelector('h2')?.classList).toContain('font-medium');
    expect(card.classList).toContain('py-6');
  });

  it('draws the plain heading and the 20px padding when asked', () => {
    const [, card] = renderCards();

    expect(card.querySelector('h2')?.classList).toContain('font-normal');
    expect(card.classList).toContain('py-5');
  });
});
