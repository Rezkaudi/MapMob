import { LiveCategory } from '../../categories/data/live-category';
import { LiveCity } from '../../regions/data/live-city';
import { LiveRegion } from '../../regions/data/live-region';
import { toLivePlaceFormOptions } from './live-place-options-from-lists';

function category(id: number, name: string, parentId: number | null = null): LiveCategory {
  return {
    id,
    parent_id: parentId,
    name,
    slug: name,
    is_active: true,
    icon: null,
    icon_color: null,
    parent: null,
    updated_at: '2026-10-01T00:00:00Z',
  };
}

const REGION: LiveRegion = {
  id: 6,
  name: { ar: 'محافظة طرطوس', en: 'tartous Governorate' },
  is_active: true,
  updated_at: '2026-10-01T00:00:00Z',
};

const CITY: LiveCity = {
  id: 7,
  region_id: 6,
  name: 'tartus city',
  is_active: true,
  updated_at: '2026-10-01T00:00:00Z',
};

describe('toLivePlaceFormOptions', () => {
  it('nests sub categories under their parent and areas under their governorate, named as the place pages name them', () => {
    const options = toLivePlaceFormOptions(
      [category(8, 'صيدلية'), category(20, 'صيدلية ليلية', 8)],
      [REGION],
      [CITY],
    );

    expect(options).toEqual({
      mainCategories: [
        { id: '8', name: 'صيدلية', subCategories: [{ id: '20', name: 'صيدلية ليلية' }] },
      ],
      governorates: [
        { id: '6', name: 'tartous Governorate', areas: [{ id: '7', name: 'tartus city' }] },
      ],
    });
  });

  it('falls back to the Arabic governorate name when there is no English one', () => {
    const options = toLivePlaceFormOptions(
      [],
      [{ ...REGION, name: { ar: 'محافظة طرطوس', en: '' } }],
      [],
    );

    expect(options.governorates?.[0].name).toBe('محافظة طرطوس');
  });
});
