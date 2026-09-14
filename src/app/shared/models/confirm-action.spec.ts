import { statusChangeActionFor, statusAfter } from './confirm-action';

describe('confirm actions', () => {
  it('offers to suspend an active entry and to activate a suspended one', () => {
    expect(statusChangeActionFor('active')).toBe('suspend');
    expect(statusChangeActionFor('suspended')).toBe('activate');
  });

  it('knows the status each change leads to', () => {
    expect(statusAfter('activate')).toBe('active');
    expect(statusAfter('suspend')).toBe('suspended');
  });
});
