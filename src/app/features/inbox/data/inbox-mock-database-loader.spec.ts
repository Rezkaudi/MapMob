import { firstValueFrom } from 'rxjs';
import { InboxMockDatabaseLoader } from './inbox-mock-database-loader';

describe('InboxMockDatabaseLoader', () => {
  it('loads the seed on the first request', async () => {
    const loader = new InboxMockDatabaseLoader();

    const notifications = await firstValueFrom(loader.request((database) => database.list()));

    expect(notifications.length).toBeGreaterThan(0);
  });

  it('keeps one database, so a notification stays read', async () => {
    const loader = new InboxMockDatabaseLoader();
    const [first] = await firstValueFrom(loader.request((database) => database.list()));

    await firstValueFrom(loader.request((database) => database.markAsRead(first.id)));
    const reloaded = await firstValueFrom(loader.request((database) => database.list()));

    expect(reloaded.find((one) => one.id === first.id)?.isRead).toBe(true);
  });
});
