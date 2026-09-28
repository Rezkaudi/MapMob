import { TestBed } from '@angular/core/testing';
import { AuthBrandPanel } from './auth-brand-panel';

function render() {
  const fixture = TestBed.createComponent(AuthBrandPanel);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('AuthBrandPanel', () => {
  it('shows the wordmark and the tagline from the design', () => {
    const text = render().textContent;

    expect(text).toContain('MapMob');
    expect(text).toContain('منصة متكاملة لإدارة الأماكن والخدمات والمستخدمين');
  });

  it('aligns the brand lockup with the tagline edge, so RTL keeps it on the right', () => {
    const lockup = render().querySelector('img[src*="mapmob-logo"]')!.parentElement!.parentElement!;

    expect(lockup.classList).toContain('items-start');
    expect(lockup.classList).not.toContain('items-end');
  });

  it('pins the lockup 322px from the top, as every login frame draws it', () => {
    const lockup = render().querySelector('img[src*="mapmob-logo"]')!.parentElement!.parentElement!;

    expect(lockup.classList).toContain('top-[322px]');
  });

  it('draws the two outlined ellipses of the frames', () => {
    const rings = render().querySelectorAll('[data-role="ring"]');

    expect(rings.length).toBe(2);
    expect(rings[0].classList).toContain('w-[464.84px]');
  });

  it('has no appearance switch left, since both login tabs share one look', () => {
    const fixture = TestBed.createComponent(AuthBrandPanel);

    expect('appearance' in fixture.componentInstance).toBe(false);
  });

  it('hides itself from screen readers, since it only repeats the brand', () => {
    expect(render().firstElementChild!.getAttribute('aria-hidden')).toBe('true');
  });
});
