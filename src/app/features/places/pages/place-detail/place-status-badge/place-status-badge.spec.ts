import { TestBed } from '@angular/core/testing';
import { PlaceStatus } from '../../../models/place-status';
import { PlaceStatusBadge } from './place-status-badge';

function render(status: PlaceStatus): HTMLElement {
  const fixture = TestBed.createComponent(PlaceStatusBadge);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('[data-role="status-badge"]');
}

describe('PlaceStatusBadge', () => {
  it('names the status in a solid round pill', () => {
    const badge = render('active');

    expect(badge.textContent?.trim()).toBe('نشط');
    expect(badge.classList).toContain('rounded-full');
    expect(badge.classList).toContain('bg-status-success');
  });

  it('colours a suspended place red and a pending one amber', () => {
    expect(render('suspended').classList).toContain('bg-closed');
    expect(render('pending').classList).toContain('bg-status-warning');
  });

  it('leads with a white dot, so it sits on the right of the word', () => {
    const [dot, label] = [...render('active').children];

    expect(dot.classList).toContain('bg-white');
    expect(label.textContent?.trim()).toBe('نشط');
  });
});
