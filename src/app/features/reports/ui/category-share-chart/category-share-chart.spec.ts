import { TestBed } from '@angular/core/testing';
import { CategoryShare } from '../../models/category-share';
import { CategoryShareChart } from './category-share-chart';

const SHARES: readonly CategoryShare[] = [
  { categoryName: 'مطاعم', share: 29 },
  { categoryName: 'كافيات', share: 22 },
];

describe('CategoryShareChart', () => {
  function renderFixture(shares: readonly CategoryShare[], isLoading = false) {
    const fixture = TestBed.createComponent(CategoryShareChart);
    fixture.componentRef.setInput('title', 'الشركات والمتاجر حسب التصنيف');
    fixture.componentRef.setInput('shares', shares);
    fixture.componentRef.setInput('isLoading', isLoading);
    fixture.detectChanges();
    return fixture;
  }

  function render(shares: readonly CategoryShare[], isLoading = false): HTMLElement {
    return renderFixture(shares, isLoading).nativeElement;
  }

  function tooltipText(host: HTMLElement): string | undefined {
    return host.querySelector('[data-testid="category-share-tooltip"]')?.textContent?.trim();
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
    const slices = Array.from(render(SHARES).querySelectorAll('path'));

    expect(slices.map((slice) => slice.getAttribute('aria-label'))).toEqual([
      'مطاعم 29%',
      'كافيات 22%',
    ]);
  });

  it('shows no tooltip until a slice is pointed at', () => {
    expect(tooltipText(render(SHARES))).toBeUndefined();
  });

  it('shows the name and the share of the slice under the pointer', () => {
    const fixture = renderFixture(SHARES);
    const host: HTMLElement = fixture.nativeElement;

    host.querySelectorAll('path')[1].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(tooltipText(host)).toBe('كافيات · 22%');
  });

  it('shows the tooltip of a slice reached by keyboard', () => {
    const fixture = renderFixture(SHARES);
    const host: HTMLElement = fixture.nativeElement;

    host.querySelectorAll('path')[0].dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    expect(tooltipText(host)).toBe('مطاعم · 29%');
  });

  it('hides the tooltip when the pointer leaves the slice', () => {
    const fixture = renderFixture(SHARES);
    const host: HTMLElement = fixture.nativeElement;
    const slice = host.querySelectorAll('path')[0];

    slice.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    slice.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();

    expect(tooltipText(host)).toBeUndefined();
  });

  it('dims the slices that are not pointed at', () => {
    const fixture = renderFixture(SHARES);
    const host: HTMLElement = fixture.nativeElement;

    host.querySelectorAll('path')[0].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(
      Array.from(host.querySelectorAll('path')).map((slice) => slice.getAttribute('opacity')),
    ).toEqual(['1', '0.45']);
  });

  it('shows a round placeholder while loading', () => {
    const host = render(SHARES, true);

    expect(host.querySelector('app-skeleton')).toBeTruthy();
    expect(host.querySelector('svg')).toBeNull();
  });
});
