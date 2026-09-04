import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ChartPanel } from './chart-panel';
import { ChartPeriodOption } from './chart-period-option';

const PERIODS: readonly ChartPeriodOption[] = [
  { value: 'daily', label: 'يومي' },
  { value: 'weekly', label: 'اسبوعي' },
  { value: 'monthly', label: 'شهري' },
];

@Component({
  imports: [ChartPanel],
  template: `<app-chart-panel
    title="الإيرادات"
    [periods]="periods"
    [activePeriod]="activePeriod()"
    (periodChange)="activePeriod.set($event)"
  />`,
})
class HostComponent {
  readonly periods = PERIODS;
  readonly activePeriod = signal('monthly');
}

describe('ChartPanel', () => {
  it('renders the title and one button per period', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('الإيرادات');
    expect(text).toContain('يومي');
    expect(text).toContain('اسبوعي');
    expect(text).toContain('شهري');
  });

  it('marks the active period with aria-pressed', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const active = fixture.nativeElement.querySelector('button[aria-pressed="true"]');
    expect(active.textContent.trim()).toBe('شهري');
  });

  it('emits the period the user picks', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button[aria-pressed]'),
    );
    buttons.find((button) => button.textContent?.trim() === 'يومي')!.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.activePeriod()).toBe('daily');
  });
});
