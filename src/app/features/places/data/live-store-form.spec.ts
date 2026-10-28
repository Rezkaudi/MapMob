import { buildPlaceSaveRequest } from '../testing/place-save-request-fixture';
import { toLiveStoreForm } from './live-store-form';

const SAVED_OWNER = { name: 'أحمد', phone: '0931111111', email: 'owner@example.com' };
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
    expect(form.get('ownerEmail')).toBe('owner@example.com');
    expect(form.get('ownerPassword')).toBe('secret-123');
    expect(form.has('subCategoryId')).toBe(false);
    expect(form.has('_method')).toBe(false);
  });

  it('sends no owner fields on an update that leaves the merchant login as it was', () => {
    const value = { ...buildPlaceSaveRequest().value, ownerPassword: '' };

    const form = toLiveStoreForm(value, IDS, 'update', SAVED_OWNER);

    expect(form.get('_method')).toBe('PUT');
    expect(form.has('ownerName')).toBe(false);
    expect(form.has('ownerPhone')).toBe(false);
    expect(form.has('ownerEmail')).toBe(false);
    expect(form.has('ownerPassword')).toBe(false);
  });

  it('sends the merchant email and phone on an update only when they changed', () => {
    const value = {
      ...buildPlaceSaveRequest().value,
      ownerEmail: 'new@example.com',
      ownerPhone: '0939999999',
      ownerPassword: '',
    };

    const form = toLiveStoreForm(value, IDS, 'update', SAVED_OWNER);

    expect(form.get('ownerEmail')).toBe('new@example.com');
    expect(form.get('ownerPhone')).toBe('0939999999');
    expect(form.has('ownerPassword')).toBe(false);
    expect(form.has('ownerName')).toBe(false);
  });

  it('sends a new merchant password on an update when one is typed', () => {
    const value = { ...buildPlaceSaveRequest().value, ownerPassword: 'Fresh-Pass9' };

    const form = toLiveStoreForm(value, IDS, 'update', SAVED_OWNER);

    expect(form.get('ownerPassword')).toBe('Fresh-Pass9');
    expect(form.has('ownerEmail')).toBe(false);
  });

  it('sends a suspended place in the server word', () => {
    const value = { ...buildPlaceSaveRequest().value, status: 'suspended' as const };

    expect(toLiveStoreForm(value, IDS, 'create').get('status')).toBe('inactive');
  });
});
