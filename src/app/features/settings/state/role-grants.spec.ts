import { NEW_ROLE_GRANTS, toggleGrant } from './role-grants';

describe('role grants', () => {
  it('adds a grant that is missing and removes one that is there, keeping the rest', () => {
    expect(toggleGrant(['home:view'], 'places:view')).toEqual(['home:view', 'places:view']);
    expect(toggleGrant(['home:view', 'places:view'], 'home:view')).toEqual(['places:view']);
  });

  it('starts a new role with the boxes the design ticks', () => {
    expect(NEW_ROLE_GRANTS).toHaveLength(28);
    expect(NEW_ROLE_GRANTS).toContain('reviews:delete');
    expect(NEW_ROLE_GRANTS).not.toContain('places:delete');
    expect(NEW_ROLE_GRANTS.some((grant) => grant.startsWith('system:'))).toBe(false);
  });
});
