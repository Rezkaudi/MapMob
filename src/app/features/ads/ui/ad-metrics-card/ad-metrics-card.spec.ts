import { TestBed } from '@angular/core/testing';
import { buildAdMetricCards } from '../../state/ad-metric-cards';
import { AdMetricsCard } from './ad-metrics-card';

function render() {
  const fixture = TestBed.createComponent(AdMetricsCard);
  fixture.componentRef.setInput(
    'cards',
    buildAdMetricCards({ impressions: 48250, clicks: 3860, uniqueUsers: 34120 }),
  );
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('AdMetricsCard', () => {
  it('draws the four tiles in the order the grid reads', () => {
    const tiles = Array.from(render().querySelectorAll('[class*="rounded-xl"]'));

    expect(tiles.map((tile) => tile.querySelector('span')?.textContent?.trim())).toEqual([
      'مرات الظهور',
      'عدد النقرات',
      'نسبة النقر (CTR)',
      'المستخدمون',
    ]);
  });

  it('paints the click rate in the brand blue and leaves the counts dark', () => {
    const values = Array.from(render().querySelectorAll('p > span:first-child'));

    expect(values.map((value) => value.className)).toEqual([
      'text-text-primary',
      'text-text-primary',
      'text-primary',
      'text-text-primary',
    ]);
  });

  it('writes the unit only under the reach count', () => {
    const element = render();
    const suffixes = Array.from(element.querySelectorAll('p > span:nth-child(2)'));

    expect(suffixes).toHaveLength(1);
    expect(suffixes[0].textContent?.trim()).toBe('مستمع / مشاهد');
  });
});
