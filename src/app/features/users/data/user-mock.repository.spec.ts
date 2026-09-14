import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { buildUser } from '../testing/user-fixture';
import { UserMockDatabase } from './user-mock-database';
import { UserMockRepository } from './user-mock.repository';

const AHMAD = buildUser({ id: 'u1' });
const SARA = buildUser({ id: 'u2', name: 'سارة محمود', status: 'suspended' });

describe('UserMockRepository', () => {
  let repository: UserMockRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserMockRepository,
        { provide: UserMockDatabase, useValue: new UserMockDatabase([AHMAD, SARA]) },
      ],
    });
    repository = TestBed.inject(UserMockRepository);
  });

  it('pages, filters and counts the stored users', async () => {
    const page = await firstValueFrom(
      repository.getUsers({ pageIndex: 0, pageSize: 6, status: 'suspended' }),
    );
    const summary = await firstValueFrom(repository.getSummary());

    expect(page).toEqual({ items: [SARA], totalCount: 1 });
    expect(summary.totalUserCount).toBe(2);
    expect(summary.suspendedUserCount).toBe(1);
  });

  it('changes a status, deletes a user and reads one in detail', async () => {
    await firstValueFrom(repository.setUserStatus('u1', 'suspended'));
    await firstValueFrom(repository.deleteUser('u2'), { defaultValue: undefined });
    const detail = await firstValueFrom(repository.getUserDetail('u1'));

    expect(detail.user.status).toBe('suspended');
    expect((await firstValueFrom(repository.getSummary())).totalUserCount).toBe(1);
  });

  it('fails the request for a user that does not exist', async () => {
    await expect(firstValueFrom(repository.getUserDetail('missing'))).rejects.toThrowError();
  });

  it('exports the filtered users as a CSV file', async () => {
    const file = await firstValueFrom(repository.exportUsers({ pageIndex: 0, pageSize: 6 }));

    expect(file.type).toContain('text/csv');
    expect(await file.text()).toContain('سارة محمود');
  });
});
