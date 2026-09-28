import { TestBed } from '@angular/core/testing';
import { SectionScroller } from './section-scroller';

describe('SectionScroller', () => {
  afterEach(() => history.replaceState(null, '', '/'));

  it('builds a section link on the page path, not on the base href', () => {
    history.replaceState(null, '', '/docs');

    expect(TestBed.inject(SectionScroller).linkTo('conventions')).toBe('/docs#conventions');
  });

  it('keeps the page path when it writes the section into the address', () => {
    history.replaceState(null, '', '/docs#overview');

    TestBed.inject(SectionScroller).replaceHash('conventions');

    expect(location.pathname + location.hash).toBe('/docs#conventions');
  });
});
