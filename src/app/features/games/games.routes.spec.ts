import { GAMES_ROUTES } from './games.routes';

describe('GAMES_ROUTES', () => {
  it('has the list, the add page and the edit page', () => {
    expect(GAMES_ROUTES.map((route) => route.path)).toEqual(['', 'new', ':id/edit']);
  });
});
