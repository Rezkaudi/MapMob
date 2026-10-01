import { TestBed } from '@angular/core/testing';
import { MerchantStoriesSkeleton } from './merchant-stories-skeleton';

function render(): HTMLElement {
  const fixture = TestBed.createComponent(MerchantStoriesSkeleton);
  fixture.detectChanges();
  return fixture.nativeElement;
}

const countIn = (host: HTMLElement, role: string): number =>
  host.querySelectorAll(`[data-role="${role}"] app-skeleton`).length;

describe('MerchantStoriesSkeleton', () => {
  it('stands in for the two quota cards, the heading and two story cards', () => {
    const host = render();

    expect(countIn(host, 'quota')).toBe(2);
    expect(countIn(host, 'heading')).toBe(2);
    expect(countIn(host, 'cards')).toBe(2);
  });

  it('tells screen readers the stories are loading', () => {
    expect(render().querySelector('[role="status"]')?.textContent?.trim()).toBe('جاري التحميل');
  });
});
