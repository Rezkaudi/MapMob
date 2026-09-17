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

@Component({
  imports: [StatCard],
  template: `<app-stat-card icon="star-rounded" label="مبلغ عنها" value="4" alert="تتطلب إجراء" />`,
})
class HostWithAlertComponent {}

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

  it('shows an alert as a red chip with a flag, and no alert chip otherwise', () => {
    const plain = TestBed.createComponent(HostComponent);
    plain.detectChanges();
    const alerted = TestBed.createComponent(HostWithAlertComponent);
    alerted.detectChanges();

    expect(plain.nativeElement.querySelector('[data-role="alert"]')).toBeNull();
    const chip: HTMLElement = alerted.nativeElement.querySelector('[data-role="alert"]');
    expect(chip.textContent?.trim()).toBe('تتطلب إجراء');
    expect(chip.classList).toContain('text-status-error');
    expect(chip.querySelector('app-icon')).toBeTruthy();
  });

  it('keeps the value left-to-right, so "340+" is not flipped to "+340"', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const value: HTMLElement = fixture.nativeElement.querySelector('[data-role="value"]');
    expect(value.getAttribute('dir')).toBe('ltr');
  });
});

describe('StatCard badge', () => {
  function renderBadge(tone: 'success' | 'warning' | 'error') {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('icon', 'package');
    fixture.componentRef.setInput('label', 'المشتركون النشطون');
    fixture.componentRef.setInput('value', '1200');
    fixture.componentRef.setInput('badge', '90% من الإجمالي');
    fixture.componentRef.setInput('badgeTone', tone);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('[data-role="badge"]') as HTMLElement;
  }

  it('shows the badge as a plain chip, with no icon beside the words', () => {
    const chip = renderBadge('success');

    expect(chip.textContent?.trim()).toBe('90% من الإجمالي');
    expect(chip.querySelector('app-icon')).toBeNull();
  });

  it('tints the chip by tone', () => {
    expect(renderBadge('success').className).toContain('text-status-success');
    expect(renderBadge('warning').className).toContain('text-accent');
    expect(renderBadge('error').className).toContain('text-closed');
  });

  it('leaves the chip out when there is no badge', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-role="badge"]')).toBeNull();
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

describe('StatCard dot', () => {
  function renderDot(tone: 'primary' | 'warning' | 'error' | 'success') {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('label', 'قيد المراجعة');
    fixture.componentRef.setInput('value', '10');
    fixture.componentRef.setInput('dotTone', tone);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('draws a 16px dot in place of the icon tile', () => {
    const element = renderDot('warning');

    const dot = element.querySelector('[data-role="dot"]') as HTMLElement;
    expect(dot.classList).toContain('size-4');
    expect(element.querySelector('app-icon')).toBeNull();
  });

  it('tints the dot by tone', () => {
    const dotOf = (tone: 'primary' | 'warning' | 'error' | 'success') =>
      renderDot(tone).querySelector('[data-role="dot"]')?.classList;

    expect(dotOf('primary')).toContain('bg-primary');
    expect(dotOf('warning')).toContain('bg-accent');
    expect(dotOf('error')).toContain('bg-closed');
    expect(dotOf('success')).toContain('bg-status-success');
  });

  it('keeps the icon tile when there is no dot', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-role="dot"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-icon')).toBeTruthy();
  });
});
