import { TestBed } from '@angular/core/testing';
import { buildEndpoint, buildFeature } from '../../testing/api-docs-fixture';
import { DocsSidebar } from './docs-sidebar';

function render() {
  const fixture = TestBed.createComponent(DocsSidebar);
  fixture.componentRef.setInput('features', [
    buildFeature({
      id: 'places',
      name: 'Places',
      endpoints: [buildEndpoint(), buildEndpoint({ id: 'b' })],
    }),
  ]);
  fixture.componentRef.setInput('domains', [{ id: 'db-locations', name: 'Locations' }]);
  fixture.componentRef.setInput('pagePath', '/docs');
  fixture.detectChanges();
  return fixture;
}

describe('DocsSidebar', () => {
  it('links every part of the page, with the endpoint count per feature', () => {
    const links: HTMLAnchorElement[] = [...render().nativeElement.querySelectorAll('a')];
    const hrefs = links.map((link) => link.getAttribute('href'));

    expect(hrefs).toContain('/docs#overview');
    expect(hrefs).toContain('/docs#conventions');
    expect(hrefs).toContain('/docs#places');
    expect(hrefs).toContain('/docs#db-locations');
    expect(hrefs).toContain('/docs#export');
    expect(
      links.find((link) => link.getAttribute('href') === '/docs#places')?.textContent,
    ).toContain('2');
  });

  it('marks the section being read', () => {
    const fixture = render();
    fixture.componentRef.setInput('activeId', 'places');
    fixture.detectChanges();
    const current: HTMLAnchorElement[] = [
      ...fixture.nativeElement.querySelectorAll('a[aria-current]'),
    ];

    expect(current.map((link) => link.getAttribute('href'))).toEqual(['/docs#places']);
    expect(current[0].getAttribute('aria-current')).toBe('location');
  });

  it('asks the page to scroll instead of changing the URL', () => {
    const fixture = render();
    const navigated = vi.fn();
    fixture.componentInstance.navigate.subscribe(navigated);
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a[href="/docs#places"]');
    const click = new MouseEvent('click', { cancelable: true });

    link.dispatchEvent(click);

    expect(navigated).toHaveBeenCalledWith('places');
    expect(click.defaultPrevented).toBe(true);
  });
});
