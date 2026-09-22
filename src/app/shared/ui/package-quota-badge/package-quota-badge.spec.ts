import { TestBed } from '@angular/core/testing';
import { PackageQuotaBadge } from './package-quota-badge';

function render(used = 2, limit = 3) {
  const fixture = TestBed.createComponent(PackageQuotaBadge);
  fixture.componentRef.setInput('packageLabel', 'مجانية');
  fixture.componentRef.setInput('used', used);
  fixture.componentRef.setInput('limit', limit);
  fixture.componentRef.setInput('noun', 'صور');
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('PackageQuotaBadge', () => {
  it('names the package and counts what is left of it', () => {
    const element = render();

    expect(element.textContent).toContain('الباقة الحالية:');
    expect(element.textContent).toContain('مجانية');
    expect(element.textContent).toContain('2 / 3 صور');
  });

  it('fills the bar by the share used', () => {
    const fill = render().querySelector('[data-testid="quota-fill"]') as HTMLElement;

    expect(fill.style.width).toBe('66.66666666666666%');
  });

  it('never fills past the whole bar', () => {
    const fill = render(5, 3).querySelector('[data-testid="quota-fill"]') as HTMLElement;

    expect(fill.style.width).toBe('100%');
  });

  it('flags the count when a package change leaves more files than it allows', () => {
    const element = render(5, 3);
    const count = element.querySelector('[data-testid="quota-count"]') as HTMLElement;

    expect(count.textContent?.trim()).toBe('5 / 3 صور');
    expect(count.className).toContain('text-error');
    expect(element.querySelector('[data-testid="quota-fill"]')?.className).toContain('bg-error');
  });

  it('keeps the count in the brand colour while it is inside the package', () => {
    const count = render(2, 3).querySelector('[data-testid="quota-count"]') as HTMLElement;

    expect(count.className).toContain('text-primary');
    expect(count.className).not.toContain('text-error');
  });

  it('leaves the bar empty when the package allows nothing', () => {
    const fill = render(0, 0).querySelector('[data-testid="quota-fill"]') as HTMLElement;

    expect(fill.style.width).toBe('0%');
  });
});
