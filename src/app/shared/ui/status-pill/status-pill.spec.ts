import { TestBed } from '@angular/core/testing';
import { ActivationStatus } from '../../models/activation-status';
import { StatusPill } from './status-pill';

describe('StatusPill', () => {
  function render(status: ActivationStatus, label: string): HTMLElement {
    const fixture = TestBed.createComponent(StatusPill);
    fixture.componentRef.setInput('status', status);
    fixture.componentRef.setInput('label', label);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('span');
  }

  it('shows an active entry as a green pill with its label', () => {
    const pill = render('active', 'نشط');

    expect(pill.textContent?.trim()).toBe('نشط');
    expect(pill.className).toContain('bg-status-success');
  });

  it('shows a suspended entry as a red pill with its label', () => {
    const pill = render('suspended', 'معطل');

    expect(pill.textContent?.trim()).toBe('معطل');
    expect(pill.className).toContain('bg-closed');
  });
});
