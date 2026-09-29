import { TestBed } from '@angular/core/testing';
import { FormArray } from '@angular/forms';
import {
  DeliveryLinkFormGroup,
  createDeliveryLinkGroup,
} from '../../../../../shared/forms/delivery-link-form';
import { DeliveryPlatform } from '../../../../../shared/models/delivery-platform';
import { PlaceDeliverySection } from './place-delivery-section';

const PLATFORMS: DeliveryPlatform[] = [
  { id: '3', name: 'طلبات', latinName: 'Talabat', logoUrl: null },
  { id: '2', name: 'يلا غو دليفري', latinName: 'YallaGo', logoUrl: null },
];

function buildLinks(): FormArray<DeliveryLinkFormGroup> {
  const links = new FormArray(PLATFORMS.map(() => createDeliveryLinkGroup()));
  links.at(0).setValue({
    platformId: '3',
    isEnabled: true,
    storeUrl: 'https://www.talabat.com/syria/alhayat-pharmacy',
  });
  links.at(1).setValue({ platformId: '2', isEnabled: false, storeUrl: '' });
  return links;
}

function render(links = buildLinks()) {
  const fixture = TestBed.createComponent(PlaceDeliverySection);
  fixture.componentRef.setInput('platforms', PLATFORMS);
  fixture.componentRef.setInput('links', links);
  fixture.detectChanges();
  const element: HTMLElement = fixture.nativeElement;
  const rows = () =>
    Array.from(element.querySelectorAll<HTMLElement>('[data-role="platform-row"]'));
  return { fixture, links, element, rows };
}

describe('PlaceDeliverySection', () => {
  it('is the "منصات التوصيل" card, one row per platform named both ways', () => {
    const { element, rows } = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('منصات التوصيل');
    expect(
      rows().map((row) => row.querySelector('[data-role="platform-name"]')?.textContent?.trim()),
    ).toEqual(['طلبات (Talabat)', 'يلا غو دليفري (YallaGo)']);
  });

  it('asks for the store link only on a switched-on platform', () => {
    const { rows } = render();

    const [talabat, yallaGo] = rows();
    const field = talabat.querySelector<HTMLInputElement>('input[type="url"]')!;
    expect(field.value).toBe('https://www.talabat.com/syria/alhayat-pharmacy');
    expect(field.getAttribute('dir')).toBe('ltr');
    expect(talabat.querySelector('label')?.textContent).toContain('رابط المتجر على Talabat');
    expect(yallaGo.querySelector('input[type="url"]')).toBeNull();
  });

  it('switches a platform on and opens its link field', () => {
    const { fixture, links, rows } = render();

    rows()[1].querySelector<HTMLButtonElement>('[role="switch"]')!.click();
    fixture.detectChanges();

    expect(links.at(1).controls.isEnabled.value).toBe(true);
    expect(rows()[1].querySelector('input[type="url"]')).not.toBeNull();
  });

  it('says the link is missing once a switched-on field is left empty', () => {
    const links = buildLinks();
    links.at(0).controls.storeUrl.setValue('');
    const { fixture, rows } = render(links);

    links.markAllAsTouched();
    fixture.detectChanges();

    expect(rows()[0].querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'أدخل رابط المتجر على المنصة',
    );
  });

  it('draws a switched-on platform on a tint and a switched-off one in a thin frame', () => {
    const [talabat, yallaGo] = render().rows();

    expect(talabat.classList).toContain('bg-[rgba(247,249,251,0.5)]');
    expect(yallaGo.classList).toContain('border-[rgba(192,199,213,0.6)]');
  });
});
