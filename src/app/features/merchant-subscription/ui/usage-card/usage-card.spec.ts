import { TestBed } from '@angular/core/testing';
import { UsageCardView } from '../../models/usage-card-view';
import { UsageCard } from './usage-card';

const ROOMY: UsageCardView = {
  title: 'معرض الصور',
  iconName: 'media',
  usedCount: 15,
  limitText: '/ 20 صورة',
  usedPercent: 75,
  percentText: '75%',
  isNearLimit: false,
  note: 'متبقي 5 صور للرفع.',
};

function render(card: UsageCardView): HTMLElement {
  const fixture = TestBed.createComponent(UsageCard);
  fixture.componentRef.setInput('card', card);
  fixture.detectChanges();
  return fixture.nativeElement;
}

function textOf(element: HTMLElement, role: string): string {
  return element.querySelector(`[data-role="${role}"]`)?.textContent?.trim() ?? '';
}

describe('UsageCard', () => {
  it('shows the title, the count against its limit and the share', () => {
    const element = render(ROOMY);

    expect(element.querySelector('h3')?.textContent?.trim()).toBe('معرض الصور');
    expect(textOf(element, 'used')).toBe('15');
    expect(textOf(element, 'limit')).toBe('/ 20 صورة');
    expect(textOf(element, 'percent')).toBe('75%');
    expect(textOf(element, 'note')).toBe('متبقي 5 صور للرفع.');
  });

  it('fills the bar to the used share and reports it', () => {
    const bar = render(ROOMY).querySelector('[role="progressbar"]') as HTMLElement;

    expect(bar.getAttribute('aria-valuenow')).toBe('75');
    expect((bar.firstElementChild as HTMLElement).style.width).toBe('75%');
  });

  it('turns amber with the info mark near the limit', () => {
    const element = render({ ...ROOMY, isNearLimit: true, note: 'متبقي منتجان فقط.' });

    expect(element.querySelector('[role="progressbar"] > div')?.className).toContain('bg-accent');
    expect(element.querySelector('[data-role="note"]')?.className).toContain('text-[#B45309]');
    expect(element.innerHTML).toContain('info-circle-filled');
  });

  it('uses the blue bar and the green tick with room left', () => {
    const element = render(ROOMY);

    expect(element.querySelector('[role="progressbar"] > div')?.className).toContain('bg-primary');
    expect(element.innerHTML).toContain('check-circle-line');
  });
});
