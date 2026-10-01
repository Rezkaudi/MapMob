import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppIcon } from '../app-icon/app-icon';
import { DistributionCard } from './distribution-card';

function build() {
  const fixture = TestBed.createComponent(DistributionCard);
  fixture.componentRef.setInput('heading', 'توزيع الوسائط');
  fixture.componentRef.setInput('tiles', [
    { key: 'image', label: 'صور نشطة', count: 2, icon: 'media', tone: 'primary' },
    { key: 'video', label: 'فيديو نشط', count: 1, icon: 'video', tone: 'accent' },
  ]);
  fixture.componentRef.setInput('limitText', 'الحد المسموح 5 وسائط');
  fixture.detectChanges();
  return fixture;
}

const elementOf = () => build().nativeElement as HTMLElement;

describe('DistributionCard', () => {
  it('shows the heading, each tile and the limit line', () => {
    const element = elementOf();
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

  it('tints a primary tile blue and an accent tile amber, as the frames do', () => {
    const icons = [...elementOf().querySelectorAll('[data-role="kind-icon"]')];

    expect(icons[0].className).toContain('text-primary');
    expect(icons[1].className).toContain('text-accent');
  });

  it('draws the icon each tile names', () => {
    const fixture = build();
    const icons = fixture.debugElement.queryAll(By.directive(AppIcon));

    expect(icons.map((icon) => (icon.componentInstance as AppIcon).name())).toEqual([
      'media',
      'video',
    ]);
  });
});
