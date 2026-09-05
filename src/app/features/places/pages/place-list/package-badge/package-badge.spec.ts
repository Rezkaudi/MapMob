import { TestBed } from '@angular/core/testing';
import { PackageBadge } from './package-badge';

describe('PackageBadge', () => {
  it('shows the Arabic label for the package', () => {
    const fixture = TestBed.createComponent(PackageBadge);
    fixture.componentRef.setInput('package', 'premium');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('مميزة');
  });
});
