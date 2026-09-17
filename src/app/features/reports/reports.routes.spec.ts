import { REPORTS_ROUTES } from './reports.routes';

describe('REPORTS_ROUTES', () => {
  it('opens the overview at the root', () => {
    expect(REPORTS_ROUTES.map((route) => route.path)).toEqual(['']);
  });
});
