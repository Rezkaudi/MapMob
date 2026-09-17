import { TestBed } from '@angular/core/testing';
import { MapSettings } from '../../models/map-settings';
import { MapSettingsCard } from './map-settings-card';

function render() {
  const fixture = TestBed.createComponent(MapSettingsCard);
  fixture.componentRef.setInput('map', { distanceUnit: 'kilometer', searchRadiusKm: 15 });
  const saved: MapSettings[] = [];
  fixture.componentInstance.saved.subscribe((map) => saved.push(map));
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, saved };
}

describe('MapSettingsCard', () => {
  it('offers the distance units and shows the radius in the chosen unit', () => {
    const { fixture, element } = render();
    const unit = element.querySelector('#map-distance-unit') as HTMLSelectElement;

    expect(Array.from(unit.options).map((option) => option.textContent?.trim())).toEqual([
      'كيلو متر (كم / km) - افتراضي',
      'ميل (mi)',
    ]);
    expect((element.querySelector('#map-search-radius') as HTMLInputElement).value).toBe('15');
    expect(element.querySelector('[data-role="radius-unit"]')?.textContent?.trim()).toBe('كم');

    unit.value = unit.options[1].value;
    unit.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(element.querySelector('[data-role="radius-unit"]')?.textContent?.trim()).toBe('ميل');
  });

  it('saves the map settings', () => {
    const { element, saved } = render();
    const radius = element.querySelector('#map-search-radius') as HTMLInputElement;

    radius.value = '25';
    radius.dispatchEvent(new Event('input'));
    (element.querySelector('button[type="submit"]') as HTMLButtonElement).click();

    expect(saved).toEqual([{ distanceUnit: 'kilometer', searchRadiusKm: 25 }]);
  });
});
