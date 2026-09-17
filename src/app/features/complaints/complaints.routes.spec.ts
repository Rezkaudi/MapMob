import { COMPLAINTS_ROUTES } from './complaints.routes';

describe('COMPLAINTS_ROUTES', () => {
  it('opens the list at the root and a complaint detail page by id', () => {
    expect(COMPLAINTS_ROUTES.map((route) => route.path)).toEqual(['', ':id']);
  });
});
