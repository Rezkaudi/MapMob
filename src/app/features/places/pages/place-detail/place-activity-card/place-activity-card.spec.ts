import { TestBed } from '@angular/core/testing';
import { PlaceActivityCard } from './place-activity-card';

function render(): HTMLElement {
  const fixture = TestBed.createComponent(PlaceActivityCard);
  fixture.componentRef.setInput('activity', {
    addedAt: '2024-10-24T00:00:00.000Z',
    updatedLabel: 'منذ يومين',
  });
  fixture.detectChanges();
  return fixture.nativeElement;
}

describe('PlaceActivityCard', () => {
  it('shows when the place was added and last changed', () => {
    const element = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('سجل النشاط');
    expect(element.querySelector('[data-role="card-date"]')?.textContent?.trim()).toBe(
      'Oct 24, 2024',
    );
    expect(element.textContent).toContain('منذ يومين');
  });

  it('has no edit link, as the log is written by the system', () => {
    expect(render().querySelector('button')).toBeNull();
  });
});
