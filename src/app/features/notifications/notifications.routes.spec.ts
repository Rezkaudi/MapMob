import { NOTIFICATIONS_ROUTES } from './notifications.routes';

describe('NOTIFICATIONS_ROUTES', () => {
  it('opens the list at the root, and the form to create or edit', () => {
    expect(NOTIFICATIONS_ROUTES.map((route) => route.path)).toEqual(['', 'new', ':id/edit']);
  });
});
