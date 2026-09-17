import { CONTENT_ROUTES } from './content.routes';

describe('CONTENT_ROUTES', () => {
  it('opens the pages list at the root and each page editor at its kind', () => {
    expect(CONTENT_ROUTES.map((route) => route.path)).toEqual([
      '',
      'about',
      'terms',
      'privacy',
      'contact',
      'faq',
    ]);
  });

  it('tells the shared legal editor which page it edits', () => {
    const kindOf = (path: string) => CONTENT_ROUTES.find((route) => route.path === path)?.data;

    expect(kindOf('terms')).toEqual({ kind: 'terms' });
    expect(kindOf('privacy')).toEqual({ kind: 'privacy' });
  });
});
