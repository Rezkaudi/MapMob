import { buildLiveDeliveryPlatform } from '../../../shared/testing/live-delivery-platform-fixture';
import { buildLiveStoreDeliveryLink } from '../../../shared/testing/live-store-delivery-link-fixture';
import {
  buildDeliveryPlatform,
  buildDeliveryPlatformDraft,
} from '../testing/delivery-platform-fixture';
import {
  toDeliveryPlatformEntry,
  toDeliveryPlatformSummary,
  toLinkedStore,
  toLiveDeliveryPlatformForm,
} from './live-delivery-platform-mapping';

describe('toDeliveryPlatformEntry', () => {
  it('reads one name for both, and leaves out what the server does not keep', () => {
    expect(toDeliveryPlatformEntry(buildLiveDeliveryPlatform({ is_active: false }))).toEqual({
      id: '1',
      name: 'tawseel',
      latinName: 'tawseel',
      logoUrl: 'https://api.test/storage/delivery-platforms/tawseel.jpg',
      websiteUrl: '',
      linkedStoreCount: null,
      referralCount: null,
      status: 'suspended',
      sortOrder: 1,
      createdAt: '2026-10-14T18:45:56+00:00',
    });
  });

  it('puts a platform with no position at zero', () => {
    expect(toDeliveryPlatformEntry(buildLiveDeliveryPlatform({ sort_order: null })).sortOrder).toBe(
      0,
    );
  });
});

describe('toDeliveryPlatformSummary', () => {
  it('fills the active and total counts, and leaves the rest unknown', () => {
    expect(toDeliveryPlatformSummary({ total: 5, active: 3, inactive: 2 })).toEqual({
      referralCount: null,
      mostUsedPlatform: null,
      linkedStoreCount: null,
      activeCount: 3,
      platformCount: 5,
    });
  });
});

describe('toLiveDeliveryPlatformForm', () => {
  it('sends both names, the switch, the position and the logo for a new platform', () => {
    const logo = new File(['x'], 'logo.png', { type: 'image/png' });

    const form = toLiveDeliveryPlatformForm(
      buildDeliveryPlatformDraft({ status: 'suspended', logoFile: logo }),
      null,
    );

    expect(form.get('name[ar]')).toBe('طلبات');
    expect(form.get('name[en]')).toBe('talabat');
    expect(form.get('is_active')).toBe('0');
    expect(form.get('sort_order')).toBe('5');
    expect(form.get('logo')).toBeInstanceOf(File);
    expect(form.has('_method')).toBe(false);
  });

  it('keeps the saved Arabic name when the admin left the name box as it came', () => {
    const saved = buildDeliveryPlatform({ name: 'tawseel', latinName: 'tawseel' });

    const form = toLiveDeliveryPlatformForm(
      buildDeliveryPlatformDraft({ name: 'tawseel', latinName: 'Tawseel' }),
      saved,
    );

    expect(form.get('_method')).toBe('PUT');
    expect(form.has('name[ar]')).toBe(false);
    expect(form.get('name[en]')).toBe('Tawseel');
  });

  it('sends the Arabic name when the admin typed a new one', () => {
    const saved = buildDeliveryPlatform({ name: 'tawseel' });

    const form = toLiveDeliveryPlatformForm(buildDeliveryPlatformDraft({ name: 'توصيل' }), saved);

    expect(form.get('name[ar]')).toBe('توصيل');
  });
});

describe('toLinkedStore', () => {
  it('builds the dialog row from the store page and its link to the platform', () => {
    const store = {
      id: '4',
      name: 'مطعم المدينة',
      logoUrl: null,
      mainCategory: { id: '1', name: 'مطاعم' },
      location: {
        governorate: { id: '1', name: 'دمشق' },
        area: { id: '1', name: 'داريا' },
      },
    };

    expect(toLinkedStore(store, buildLiveStoreDeliveryLink({ storeId: '4' }))).toEqual({
      id: '4',
      name: 'مطعم المدينة',
      logoUrl: null,
      category: { id: '1', name: 'مطاعم' },
      governorate: { id: '1', name: 'دمشق' },
      area: { id: '1', name: 'داريا' },
      storeUrl: 'https://tawseel.com/store/1',
      linkedAt: '2026-10-14T19:01:49+00:00',
    });
  });
});
