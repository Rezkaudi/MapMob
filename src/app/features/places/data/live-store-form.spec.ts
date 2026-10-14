import { buildPlaceSaveRequest } from '../testing/place-save-request-fixture';
import { toLiveStoreForm } from './live-store-form';

const IDS = { mainCategoryId: '8', subCategoryId: null, governorateId: '6', areaId: '7' };

describe('toLiveStoreForm', () => {
  it('writes a new place in the field names the server saves', () => {
    const form = toLiveStoreForm(buildPlaceSaveRequest().value, IDS, 'create');

    expect(form.get('name[ar]')).toBe('صيدلية الأمل');
    expect(form.get('name[en]')).toBe('صيدلية الأمل');
    expect(form.get('mainCategoryId')).toBe('8');
    expect(form.get('governorateId')).toBe('6');
    expect(form.get('areaId')).toBe('7');
    expect(form.get('address[ar]')).toBe('شارع الثورة');
    expect(form.get('description[ar]')).toBe('صيدلية مناوبة');
    expect(form.get('latitude')).toBe('34.89');
    expect(form.get('phone')).toBe('0932222222');
    expect(form.get('whatsapp')).toBe('0932222222');
    expect(form.get('status')).toBe('active');
    expect(form.get('ownerName')).toBe('أحمد');
    expect(form.get('ownerPhone')).toBe('0931111111');
    expect(form.has('subCategoryId')).toBe(false);
    expect(form.has('_method')).toBe(false);
  });

  it('sends no owner fields on an update, which the server cannot save', () => {
    const form = toLiveStoreForm(buildPlaceSaveRequest().value, IDS, 'update');

    expect(form.get('_method')).toBe('PUT');
    expect(form.has('ownerName')).toBe(false);
    expect(form.has('ownerPhone')).toBe(false);
  });

  it('sends a suspended place in the server word', () => {
    const value = { ...buildPlaceSaveRequest().value, status: 'suspended' as const };

    expect(toLiveStoreForm(value, IDS, 'create').get('status')).toBe('inactive');
  });
});
