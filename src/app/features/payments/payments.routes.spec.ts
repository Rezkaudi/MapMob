import { PAYMENTS_ROUTES } from './payments.routes';

describe('PAYMENTS_ROUTES', () => {
  it('opens the list at the root', () => {
    expect(PAYMENTS_ROUTES.map((route) => route.path)).toEqual(['']);
  });
});
