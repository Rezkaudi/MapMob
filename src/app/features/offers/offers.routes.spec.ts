import { OFFERS_ROUTES } from './offers.routes';

describe('OFFERS_ROUTES', () => {
  it('opens the list at the root, the add page, and the edit page by id', () => {
    expect(OFFERS_ROUTES.map((route) => route.path)).toEqual(['', 'new', ':id/edit']);
  });
});
