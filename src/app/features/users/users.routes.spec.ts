import { USERS_ROUTES } from './users.routes';

describe('USERS_ROUTES', () => {
  it('opens the list at the root and a user detail page by id', () => {
    expect(USERS_ROUTES.map((route) => route.path)).toEqual(['', ':id']);
  });
});
