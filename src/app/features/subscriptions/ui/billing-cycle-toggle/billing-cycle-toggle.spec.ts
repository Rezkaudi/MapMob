import { TestBed } from '@angular/core/testing';
import { BillingCycleToggle } from './billing-cycle-toggle';

function render(value: 'monthly' | 'yearly' = 'monthly') {
  const fixture = TestBed.createComponent(BillingCycleToggle);
  fixture.componentRef.setInput('value', value);
  fixture.detectChanges();
  return fixture;
}

function buttonsOf(element: HTMLElement): HTMLButtonElement[] {
  return Array.from(element.querySelectorAll('button'));
}

describe('BillingCycleToggle', () => {
  it('draws the monthly choice first, so RTL puts it on the right', () => {
    const buttons = buttonsOf(render().nativeElement);

    expect(buttons[0].textContent?.trim()).toBe('شهرياً');
    expect(buttons[1].textContent).toContain('سنوياً');
  });

  it('marks the yearly saving with its own badge', () => {
    expect(render().nativeElement.textContent).toContain('خصم 20%');
  });

  it('raises only the chosen cycle onto a white card', () => {
    const buttons = buttonsOf(render().nativeElement);

    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].className).toContain('bg-white');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].className).not.toContain('bg-white');
  });

  it('reports the picked cycle', () => {
    const fixture = render();
    const valueChange = vi.fn();
    fixture.componentInstance.valueChange.subscribe(valueChange);

    buttonsOf(fixture.nativeElement)[1].click();

    expect(valueChange).toHaveBeenCalledWith('yearly');
  });
});
