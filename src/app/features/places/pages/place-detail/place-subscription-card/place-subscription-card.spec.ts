import { TestBed } from '@angular/core/testing';
import { PlaceSubscription } from '../../../models/place-subscription';
import { PlaceSubscriptionCard } from './place-subscription-card';

function render(subscription: Partial<PlaceSubscription> = {}) {
  const fixture = TestBed.createComponent(PlaceSubscriptionCard);
  fixture.componentRef.setInput('subscription', {
    package: 'premium',
    status: 'active',
    renewsAt: '2024-10-24T00:00:00.000Z',
    ...subscription,
  });
  fixture.detectChanges();
  const element: HTMLElement = fixture.nativeElement;
  return { fixture, find: (role: string) => element.querySelector(`[data-role="${role}"]`)! };
}

describe('PlaceSubscriptionCard', () => {
  it('names the plan in amber', () => {
    const plan = render().find('plan');

    expect(plan.textContent?.trim()).toBe('مميزة');
    expect(plan.classList).toContain('text-accent');
  });

  it('colours the status: green when active, red when suspended', () => {
    expect(render().find('status').classList).toContain('text-status-success');
    expect(render({ status: 'suspended' }).find('status').classList).toContain('text-closed');
  });

  it('writes the renewal date as "Oct 24, 2024"', () => {
    expect(render().find('card-date').textContent?.trim()).toBe('Oct 24, 2024');
  });

  it('asks to edit when "تعديل" is pressed', () => {
    const { fixture } = render();
    const edit = vi.fn();
    fixture.componentInstance.edit.subscribe(edit);

    fixture.nativeElement.querySelector('app-info-card button').click();

    expect(edit).toHaveBeenCalled();
  });
});
