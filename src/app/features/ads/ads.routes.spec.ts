import { ADS_ROUTES } from './ads.routes';

describe('ADS_ROUTES', () => {
  it('opens the list at the root, the add page, and the edit page by id', () => {
    expect(ADS_ROUTES.map((route) => route.path)).toEqual(['', 'new', ':id/edit']);
  });
});
