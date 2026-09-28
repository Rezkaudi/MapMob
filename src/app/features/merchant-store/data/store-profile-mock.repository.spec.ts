import { firstValueFrom } from 'rxjs';
import { toStoreProfileFormValue, toStoreProfileUpdate } from '../state/store-profile-form-mapping';
import { STORE_PROFILE_SEED } from './store-profile-mock-seed';
import { StoreProfileMockRepository } from './store-profile-mock.repository';

describe('StoreProfileMockRepository', () => {
  it('serves the pharmacy the design draws', async () => {
    const profile = await firstValueFrom(new StoreProfileMockRepository().getProfile());

    expect(profile).toEqual(STORE_PROFILE_SEED);
    expect(profile.name).toBe('صيدلية الحياة');
    expect(profile.workingHours.map((day) => day.day)).toEqual([
      'saturday',
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
    ]);
  });

  it('remembers a save for the next read', async () => {
    const repository = new StoreProfileMockRepository();
    const update = {
      ...toStoreProfileUpdate(toStoreProfileFormValue(STORE_PROFILE_SEED), null),
      name: 'صيدلية الشفاء',
    };

    const saved = await firstValueFrom(repository.saveProfile(update));
    const reread = await firstValueFrom(repository.getProfile());

    expect(saved.name).toBe('صيدلية الشفاء');
    expect(reread.name).toBe('صيدلية الشفاء');
  });
});
