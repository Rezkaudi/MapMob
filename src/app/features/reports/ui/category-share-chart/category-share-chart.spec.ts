import { TestBed } from '@angular/core/testing';
import { CategoryShare } from '../../models/category-share';
import { CategoryShareChart } from './category-share-chart';

const SHARES: readonly CategoryShare[] = [
  { categoryName: 'مطاعم', share: 29 },
  { categoryName: 'كافيات', share: 22 },
];

describe('CategoryShareChart', () => {
  function render(shares: readonly CategoryShare[], isLoading = false): HTMLElement {
    const fixture = TestBed.createComponent(CategoryShareChart);
    fixture.componentRef.setInput('title', 'الشركات والمتاجر حسب التصنيف');
    fixture.componentRef.setInput('shares', shares);
    fixture.componentRef.setInput('isLoading', isLoading);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('shows its title as a heading', () => {
    expect(render(SHARES).querySelector('h2')?.textContent?.trim()).toBe(
      'الشركات والمتاجر حسب التصنيف',
    );
  });

  it('draws one slice per category in the design colours, in order', () => {
    const slices = Array.from(render(SHARES).querySelectorAll('path'));

    expect(slices.map((slice) => slice.getAttribute('fill'))).toEqual(['#8979ff', '#ff928a']);
  });

  it('writes each category name on its slice', () => {
    const labels = Array.from(render(SHARES).querySelectorAll('svg text'));

    expect(labels.map((label) => label.textContent?.trim())).toEqual(['مطاعم', 'كافيات']);
  });

  it('names each slice and its share for screen readers', () => {
    const titles = Array.from(render(SHARES).querySelectorAll('path title'));

    expect(titles.map((title) => title.textContent?.trim())).toEqual(['مطاعم 29%', 'كافيات 22%']);
  });

  it('shows a round placeholder while loading', () => {
    const host = render(SHARES, true);

    expect(host.querySelector('app-skeleton')).toBeTruthy();
    expect(host.querySelector('svg')).toBeNull();
  });
});
