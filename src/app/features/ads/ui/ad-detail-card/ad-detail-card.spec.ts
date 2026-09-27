import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AdDetailCard } from './ad-detail-card';

@Component({
  imports: [AdDetailCard],
  template: `
    <app-ad-detail-card heading="بيانات ومعلومات الإعلان"><p>المحتوى</p></app-ad-detail-card>
    <app-ad-detail-card heading="إحصائيات الأداء والتفاعل" spacing="tight" />
  `,
})
class HostComponent {}

function renderCards(): HTMLElement[] {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('section'));
}

describe('AdDetailCard', () => {
  it('titles the card over a rule and shows its content below', () => {
    const [card] = renderCards();

    expect(card.querySelector('h2')?.textContent?.trim()).toBe('بيانات ومعلومات الإعلان');
    expect(card.querySelector('h2')?.className).toContain('border-b');
    expect(card.querySelector('h2 + p')?.textContent).toBe('المحتوى');
  });

  it('sets the rows 20px below the rule, and 16px in the tight card', () => {
    const [regular, tight] = renderCards();

    expect(regular.classList).toContain('gap-5');
    expect(tight.classList).toContain('gap-4');
  });
});
