import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StatCard } from './stat-card';

@Component({
  imports: [StatCard],
  template: `<app-stat-card icon="reviews" label="إجمالي التقييمات" value="3,000" />`,
})
class HostComponent {}

@Component({
  imports: [StatCard],
  template: `<app-stat-card
    icon="users"
    label="إجمالي المستخدمين"
    value="173,000"
    delta="320 جديد"
  />`,
})
class HostWithDeltaComponent {}

@Component({
  imports: [StatCard],
  template: `<app-stat-card icon="users" label="إجمالي المستخدمين" value="0" [isLoading]="true" />`,
})
class HostLoadingComponent {}

describe('StatCard', () => {
  it('renders the label and value', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('إجمالي التقييمات');
    expect(text).toContain('3,000');
  });

  it('leaves out the delta chip when there is no delta', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-role="delta"]')).toBeNull();
  });

  it('shows the delta as a chip with a rise arrow', () => {
    const fixture = TestBed.createComponent(HostWithDeltaComponent);
    fixture.detectChanges();

    const chip: HTMLElement = fixture.nativeElement.querySelector('[data-role="delta"]');
    expect(chip.textContent).toContain('320 جديد');
    expect(chip.querySelector('app-icon')).toBeTruthy();
  });
});

describe('StatCard while loading', () => {
  it('draws placeholders instead of the label and value', () => {
    const fixture = TestBed.createComponent(HostLoadingComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);
    expect(fixture.nativeElement.textContent).not.toContain('إجمالي المستخدمين');
  });
});
