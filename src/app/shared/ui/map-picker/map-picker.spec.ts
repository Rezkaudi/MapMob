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
});
