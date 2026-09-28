import { TestBed } from '@angular/core/testing';
import { MapPicker } from './map-picker';

// Tartus, as the design shows.
const LATITUDE = 34.8959;
const LONGITUDE = 35.8866;

function render() {
  const fixture = TestBed.createComponent(MapPicker);
  fixture.componentRef.setInput('latitude', LATITUDE);
  fixture.componentRef.setInput('longitude', LONGITUDE);
  fixture.detectChanges();
  return fixture;
}

describe('MapPicker', () => {
  it('renders a canvas element for the map to attach to', () => {
    const fixture = render();

    expect(fixture.nativeElement.querySelector('[data-map-canvas]')).toBeTruthy();
  });

  it('reports the point the map was clicked at', () => {
    const fixture = render();
    let picked: { latitude: number; longitude: number } | null = null;
    fixture.componentInstance.locationPicked.subscribe((point) => (picked = point));

    fixture.componentInstance.pickPoint({ latitude: 30, longitude: 40 });

    expect(picked).toEqual({ latitude: 30, longitude: 40 });
  });
  it('lifts the loading cover once leaflet is ready', () => {
    const fixture = render();

    expect(fixture.nativeElement.querySelector('app-skeleton')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-map-canvas]')).toBeTruthy();
  });
  it('keeps the map credit bottom-right unless a caller moves it clear of its overlay', async () => {
    const fixture = TestBed.createComponent(MapPicker);
    fixture.componentRef.setInput('latitude', LATITUDE);
    fixture.componentRef.setInput('longitude', LONGITUDE);
    fixture.componentRef.setInput('attributionPosition', 'topright');
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector('.leaflet-top.leaflet-right .leaflet-control-attribution'),
    ).toBeTruthy();
    expect(
      render().nativeElement.querySelector(
        '.leaflet-bottom.leaflet-right .leaflet-control-attribution',
      ),
    ).toBeTruthy();
  });
  it('redraws the map when its box changes size, so tiles fill a box that grew after start', async () => {
    const observed: Element[] = [];
    let onResize: () => void = () => undefined;
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          onResize = callback;
        }
        observe(target: Element) {
          observed.push(target);
        }
        disconnect() {}
      },
    );
    const fixture = render();
    await fixture.whenStable();
    const invalidateSize = vi.spyOn(
      (fixture.componentInstance as unknown as { map: { invalidateSize: () => void } }).map,
      'invalidateSize',
    );

    onResize();

    expect(observed).toEqual([fixture.nativeElement.querySelector('[data-map-canvas]')]);
    expect(invalidateSize).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
