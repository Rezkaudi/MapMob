import { DeliveryLink } from '../../../shared/models/delivery-link';
import { listOpenableDeliveryLinks } from './openable-delivery-links';

function buildLink(id: string, isEnabled: boolean, storeUrl: string | null): DeliveryLink {
  return { platform: { id, name: id, latinName: id, logoUrl: null }, isEnabled, storeUrl };
}

describe('listOpenableDeliveryLinks', () => {
  it('keeps switched-on platforms with a link, in their order', () => {
    const links = [
      buildLink('talabat', true, 'https://talabat.com/a'),
      buildLink('beeorder', true, 'https://beeorder.sy/a'),
    ];

    expect(listOpenableDeliveryLinks(links).map((link) => link.platform.id)).toEqual([
      'talabat',
      'beeorder',
    ]);
  });

  it('drops switched-off platforms, even with a saved link', () => {
    expect(listOpenableDeliveryLinks([buildLink('talabat', false, 'https://t.com')])).toEqual([]);
  });

  it('drops switched-on platforms that have no link yet', () => {
    expect(listOpenableDeliveryLinks([buildLink('talabat', true, null)])).toEqual([]);
    expect(listOpenableDeliveryLinks([buildLink('talabat', true, '  ')])).toEqual([]);
  });
});
