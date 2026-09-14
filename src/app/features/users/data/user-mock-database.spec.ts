import { buildUser } from '../testing/user-fixture';
import { UserMockDatabase } from './user-mock-database';

const AHMAD = buildUser({ id: 'u1' });
const SARA = buildUser({ id: 'u2', name: 'سارة محمود' });

describe('UserMockDatabase', () => {
  it('lists and finds users', () => {
    const database = new UserMockDatabase([AHMAD, SARA]);

    expect(database.list()).toEqual([AHMAD, SARA]);
    expect(database.find('u2')).toEqual(SARA);
  });

  it('changes a status and removes a user', () => {
    const database = new UserMockDatabase([AHMAD, SARA]);

    const suspended = database.setStatus('u1', 'suspended');
    database.remove('u2');

    expect(suspended.status).toBe('suspended');
    expect(database.list()).toEqual([suspended]);
  });

  it('throws a readable error for a user that is not there', () => {
    const database = new UserMockDatabase([]);

    expect(() => database.find('missing')).toThrowError('لم يتم العثور على المستخدم');
  });
});
