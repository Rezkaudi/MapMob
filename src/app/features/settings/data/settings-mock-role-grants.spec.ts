import { ADMIN_ROLE_GRANTS, SUPPORT_ROLE_GRANTS } from './settings-mock-role-grants';

describe('mock role grants', () => {
  it('gives the admin and support roles the counts the design cards show', () => {
    expect(ADMIN_ROLE_GRANTS).toHaveLength(32);
    expect(SUPPORT_ROLE_GRANTS).toHaveLength(14);
  });
});
