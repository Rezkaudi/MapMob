import { TestBed } from '@angular/core/testing';
import { RegionStatusPill } from './region-status-pill';

describe('RegionStatusPill', () => {
  function render(status: 'active' | 'suspended'): HTMLElement {
    const fixture = TestBed.createComponent(RegionStatusPill);
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('span');
  }

  it('shows an active region as a green pill', () => {
    const pill = render('active');

    expect(pill.textContent?.trim()).toBe('نشط');
    expect(pill.className).toContain('bg-status-success');
  });

  it('shows a suspended region as a red pill', () => {
    const pill = render('suspended');

    expect(pill.textContent?.trim()).toBe('معطلة');
    expect(pill.className).toContain('bg-closed');
  });
});
