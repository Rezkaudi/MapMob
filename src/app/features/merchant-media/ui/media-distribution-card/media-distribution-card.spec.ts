import { TestBed } from '@angular/core/testing';
import { MediaDistributionCard } from './media-distribution-card';

function build() {
  const fixture = TestBed.createComponent(MediaDistributionCard);
  fixture.componentRef.setInput('tiles', [
    { kind: 'image', label: 'صور نشطة', count: 2 },
    { kind: 'video', label: 'فيديو نشط', count: 1 },
  ]);
  fixture.componentRef.setInput('limitText', 'الحد المسموح 5 وسائط');
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('MediaDistributionCard', () => {
  it('shows the heading, each tile and the limit line', () => {
    const element = build();
    const tiles = [...element.querySelectorAll('[data-role="count-tile"]')];

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('توزيع الوسائط');
    expect(
      tiles.map((tile) => tile.querySelector('[data-role="count"]')?.textContent?.trim()),
    ).toEqual(['2', '1']);
    expect(
      tiles.map((tile) => tile.querySelector('[data-role="label"]')?.textContent?.trim()),
    ).toEqual(['صور نشطة', 'فيديو نشط']);
    expect(element.querySelector('[data-role="limit"]')?.textContent?.trim()).toBe(
      'الحد المسموح 5 وسائط',
    );
  });

  it('tints the picture tile blue and the video tile amber, as the frame does', () => {
    const icons = [...build().querySelectorAll('[data-role="kind-icon"]')];

    expect(icons[0].className).toContain('text-primary');
    expect(icons[1].className).toContain('text-accent');
  });
});
