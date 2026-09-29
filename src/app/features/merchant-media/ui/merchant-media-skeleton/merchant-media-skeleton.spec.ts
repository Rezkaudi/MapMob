import { TestBed } from '@angular/core/testing';
import { MerchantMediaSkeleton } from './merchant-media-skeleton';

function render(): HTMLElement {
  const fixture = TestBed.createComponent(MerchantMediaSkeleton);
  fixture.detectChanges();
  return fixture.nativeElement;
}

const countIn = (host: HTMLElement, role: string): number =>
  host.querySelectorAll(`[data-role="${role}"] app-skeleton`).length;

describe('MerchantMediaSkeleton', () => {
  it('stands in for the two quota cards, the tabs and four media cards', () => {
    const host = render();

    expect(countIn(host, 'quota')).toBe(2);
    expect(countIn(host, 'tabs')).toBe(3);
    expect(countIn(host, 'cards')).toBe(4);
  });

  it('tells screen readers the gallery is loading', () => {
    const host = render();

    expect(host.querySelector('[role="status"]')?.textContent?.trim()).toBe('جاري التحميل');
  });
});
