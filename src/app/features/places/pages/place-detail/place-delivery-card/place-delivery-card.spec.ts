import { TestBed } from '@angular/core/testing';
import { DeliveryLink } from '../../../../../shared/models/delivery-link';
import { PlaceDeliveryCard } from './place-delivery-card';

function buildLink(overrides: Partial<DeliveryLink> & { name: string }): DeliveryLink {
  const { name, ...rest } = overrides;
  return {
    platform: { id: name, name, latinName: name, logoUrl: null },
    isEnabled: true,
    storeUrl: `https://${name}.sy/store/alhayat`,
    ...rest,
  };
}

function render(links: readonly DeliveryLink[]) {
  const fixture = TestBed.createComponent(PlaceDeliveryCard);
  fixture.componentRef.setInput('links', links);
  fixture.detectChanges();
  return fixture;
}

describe('PlaceDeliveryCard', () => {
  it('is headed "منصات الطلب والتوصيل"', () => {
    const fixture = render([]);

    expect(fixture.nativeElement.querySelector('h2')?.textContent?.trim()).toBe(
      'منصات الطلب والتوصيل',
    );
  });

  it('lists only the switched-on platforms that have a link', () => {
    const fixture = render([
      buildLink({ name: 'beeorder' }),
      buildLink({ name: 'talabat', isEnabled: false }),
      buildLink({ name: 'yallago', storeUrl: null }),
    ]);

    const previews = fixture.nativeElement.querySelectorAll('app-delivery-link-preview');
    expect(previews.length).toBe(1);
    expect(previews[0].textContent).toContain('https://beeorder.sy/store/alhayat');
  });

  it('says so when no platform is switched on', () => {
    const fixture = render([buildLink({ name: 'talabat', isEnabled: false })]);

    expect(fixture.nativeElement.textContent).toContain('لا توجد منصات توصيل مفعلة');
  });

  it('asks to edit when "تعديل" is pressed', () => {
    const fixture = render([]);
    const edit = vi.fn();
    fixture.componentInstance.edit.subscribe(edit);

    fixture.nativeElement.querySelector('app-info-card button').click();

    expect(edit).toHaveBeenCalled();
  });
});
