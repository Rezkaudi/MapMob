import { TestBed } from '@angular/core/testing';
import { buildAdDetailView } from '../../state/ad-detail-view';
import { buildAd, buildAdDetail } from '../../testing/ad-fixture';
import { AdSchedulePeriodCard } from './ad-schedule-period-card';

function render(endsOn: string | null): HTMLElement {
  const fixture = TestBed.createComponent(AdSchedulePeriodCard);
  fixture.componentRef.setInput(
    'view',
    buildAdDetailView(buildAdDetail({ ad: buildAd({ endsOn }) })),
  );
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('AdSchedulePeriodCard', () => {
  it('puts the first day on the right and the last on the left', () => {
    const boxes = Array.from(render('2024-01-26').querySelectorAll('[class*="rounded-xl"]'));

    expect(boxes.map((box) => box.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'تاريخ ووقت البداية12 يناير 2024',
      'تاريخ ووقت النهاية26 يناير 2024',
    ]);
  });

  it('says the end is open for an ad that never stops', () => {
    expect(render(null).textContent).toContain('غير محدد');
  });
});
