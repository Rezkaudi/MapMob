import { nextMockId } from './next-mock-id';

describe('nextMockId', () => {
  it('counts on from the highest id with the prefix', () => {
    expect(nextMockId('role-', [{ id: 'role-3' }, { id: 'role-1' }])).toBe('role-4');
  });

  it('starts at one when there are no entries', () => {
    expect(nextMockId('role-', [])).toBe('role-1');
  });
});
