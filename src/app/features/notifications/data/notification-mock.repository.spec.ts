import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { buildNotificationDetail, buildNotificationDraft } from '../testing/notification-fixture';
import { NotificationMockDatabase } from './notification-mock-database';
import { NotificationMockRepository } from './notification-mock.repository';

const SENT = buildNotificationDetail({ id: 'n1', status: 'sent', sendAt: '2026-09-01T10:00' });
const SCHEDULED = buildNotificationDetail({ id: 'n2', status: 'scheduled' });

describe('NotificationMockRepository', () => {
  let repository: NotificationMockRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationMockRepository,
        {
          provide: NotificationMockDatabase,
          useValue: new NotificationMockDatabase([SENT, SCHEDULED]),
        },
        { provide: CLOCK, useValue: () => new Date(2026, 8, 8, 9, 15) },
      ],
    });
    repository = TestBed.inject(NotificationMockRepository);
  });

  it('pages, summarizes and finds the notifications', async () => {
    const page = await firstValueFrom(repository.getNotifications({ pageIndex: 0, pageSize: 1 }));
    const summary = await firstValueFrom(repository.getSummary());
    const detail = await firstValueFrom(repository.getNotification('n2'));

    expect(page).toEqual({ items: [SENT], totalCount: 2 });
    expect(summary.totalCount).toBe(2);
    expect(detail).toEqual(SCHEDULED);
  });

  it('fails for a notification that does not exist', async () => {
    await expect(firstValueFrom(repository.getNotification('missing'))).rejects.toThrowError();
  });

  it('writes through to the database, resending now at the clock time', async () => {
    await firstValueFrom(repository.rescheduleNotification('n2', '2026-09-18T16:30'));
    const resent = await firstValueFrom(repository.resendNotification('n1', null));
    await firstValueFrom(repository.duplicateNotification('n2'));
    await firstValueFrom(repository.deleteNotification('n1'));
    const page = await firstValueFrom(repository.getNotifications({ pageIndex: 0, pageSize: 4 }));

    expect(resent.sendAt).toBe('2026-09-08T09:15');
    expect(page.items.map((item) => [item.status, item.sendAt])).toEqual([
      ['draft', null],
      ['scheduled', '2026-09-18T16:30'],
    ]);
  });

  it('serves the form options, the recipients and the audience estimate', async () => {
    const options = await firstValueFrom(repository.getFormOptions());
    const recipients = await firstValueFrom(repository.searchRecipients('users', ''));
    const estimate = await firstValueFrom(
      repository.estimateAudience({
        audience: 'users',
        governorateId: 'governorate-1',
        areaId: null,
      }),
    );

    expect(options.governorates[0].areas.length).toBeGreaterThan(0);
    expect(recipients.length).toBeGreaterThan(0);
    expect(estimate.deviceCount).toBeGreaterThan(0);
  });

  it('creates and updates notifications, counting picked recipients one each', async () => {
    const created = await firstValueFrom(
      repository.createNotification(
        buildNotificationDraft({
          recipientMode: 'selected',
          recipientIds: ['recipient-1', 'recipient-2'],
        }),
      ),
    );
    const updated = await firstValueFrom(
      repository.updateNotification(created.id, buildNotificationDraft({ title: 'عنوان جديد' })),
    );

    expect(created).toMatchObject({ recipientCount: 2, sendAt: '2026-09-08T09:15' });
    expect(updated.title).toBe('عنوان جديد');
  });
});
