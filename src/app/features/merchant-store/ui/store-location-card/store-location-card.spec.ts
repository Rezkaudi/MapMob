import { TestBed } from '@angular/core/testing';
import { NO_FIELD_ERRORS, buildFilledStoreForm } from '../../testing/store-form-fixture';
import { StoreLocationCard } from './store-location-card';

function render() {
  const form = buildFilledStoreForm();
  const fixture = TestBed.createComponent(StoreLocationCard);
  fixture.componentRef.setInput('form', form);
  fixture.componentRef.setInput('governorate', { id: '6', name: 'طرطوس' });
  fixture.componentRef.setInput('area', { id: '41', name: 'طرطوس المدينة' });
  fixture.componentRef.setInput('errors', NO_FIELD_ERRORS);
  fixture.componentRef.setInput('summary', 'طرطوس، شارع الثورة، بجانب المركز الثقافي، بناء رقم 12');
  fixture.detectChanges();
  return { fixture, form, element: fixture.nativeElement as HTMLElement };
}

describe('StoreLocationCard', () => {
  it('shows the governorate on the right and the area on the left, locked', () => {
    const { element } = render();
    const cells = [...element.querySelectorAll('[data-role="locked-place"]')];

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('الموقع');
    expect(
      cells.map((cell) => [...cell.querySelectorAll('p')].map((line) => line.textContent?.trim())),
    ).toEqual([
      ['المحافظة', 'طرطوس'],
      ['المنطقة', 'طرطوس المدينة'],
    ]);
    expect(element.querySelectorAll('[data-role="locked-place"] app-icon')).toHaveLength(2);
  });

  it('lets the owner edit the detailed address', () => {
    const { element, form } = render();
    const address = element.querySelector('#store-address') as HTMLInputElement;

    expect(address.value).toBe('شارع الثورة، بجانب المركز الثقافي، بناء رقم 12');
    address.value = 'شارع هنانو';
    address.dispatchEvent(new Event('input'));

    expect(form.controls.address.value).toBe('شارع هنانو');
  });

  it('floats the governorate and full address over the map', () => {
    const { element } = render();
    const overlay = element.querySelector('[data-role="map-summary"]') as HTMLElement;

    expect([...overlay.children].map((line) => line.textContent?.trim())).toEqual([
      'طرطوس',
      'طرطوس، شارع الثورة، بجانب المركز الثقافي، بناء رقم 12',
    ]);
  });

  it('moves the saved point when the owner drops the pin elsewhere', () => {
    const { fixture, form } = render();

    fixture.debugElement
      .query((node) => node.name === 'app-map-picker')
      .triggerEventHandler('locationPicked', { latitude: 34.9, longitude: 35.89 });

    expect(form.controls.latitude.value).toBe(34.9);
    expect(form.controls.longitude.value).toBe(35.89);
    expect(form.dirty).toBe(true);
  });
});
