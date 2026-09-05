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

@Component({
  imports: [ChartPanel],
  template: `<app-chart-panel
    title="الإيرادات"
    [periods]="[]"
    activePeriod="monthly"
    [isLoading]="true"
  >
    <p data-role="chart">chart</p>
  </app-chart-panel>`,
})
class HostLoadingComponent {}

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

describe('ChartPanel while loading', () => {
  it('draws a placeholder in place of the chart', () => {
    const fixture = TestBed.createComponent(HostLoadingComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-skeleton')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-role="chart"]')).toBeNull();
  });

  it('keeps showing its title', () => {
    const fixture = TestBed.createComponent(HostLoadingComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('الإيرادات');
  });
});
