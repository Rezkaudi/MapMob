import { TestBed } from '@angular/core/testing';
import { BrandLogo } from './brand-logo';

function render(imageUrl: string | null) {
  const fixture = TestBed.createComponent(BrandLogo);
  fixture.componentRef.setInput('name', 'talabat');
  fixture.componentRef.setInput('imageUrl', imageUrl);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('BrandLogo', () => {
  it('shows the logo as a 32px rounded tile', () => {
    const element = render('https://cdn.test/talabat.png');

    const tile = element.querySelector('[data-role="brand-logo"]') as HTMLElement;
    expect(tile.classList).toContain('size-8');
    expect(tile.classList).toContain('rounded-lg');
    expect(element.querySelector('app-lazy-image')).not.toBeNull();
  });

  it('shows the first letter when there is no logo', () => {
    const element = render(null);

    expect(element.textContent?.trim()).toBe('T');
    expect(element.querySelector('app-lazy-image')).toBeNull();
  });
});
