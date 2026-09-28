import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { OwnerNotificationsMockRepository } from './owner-notifications-mock.repository';

describe('OwnerNotificationsMockRepository', () => {
  let repository: OwnerNotificationsMockRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [OwnerNotificationsMockRepository] });
    repository = TestBed.inject(OwnerNotificationsMockRepository);
  });

  it('serves the seed, newest first', async () => {
    const notifications = await firstValueFrom(repository.getNotifications());

    expect(notifications[0].title).toBe('تم تفعيل اشتراكك');
    expect(notifications).toHaveLength(5);
  });

  it('keeps a notification read once it was marked', async () => {
    const [first] = await firstValueFrom(repository.getNotifications());

    await firstValueFrom(repository.markAsRead(first.id));

    const [again] = await firstValueFrom(repository.getNotifications());
    expect(again.isRead).toBe(true);
  });
});
