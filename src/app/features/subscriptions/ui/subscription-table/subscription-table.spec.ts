import { TestBed } from '@angular/core/testing';
import { Subscription } from '../../models/subscription';
import { SubscriptionTable } from './subscription-table';

function entry(patch: Partial<Subscription> = {}): Subscription {
  return {
    id: 'sub-1',
    companyName: 'صيدلية الحياة',
    planName: 'أساسية',
    planTier: 'basic',
    price: 12,
    currencySymbol: '$',
    startedOn: '2024-01-12',
    endsOn: '2025-01-12',
    status: 'active',
    ...patch,
  };
}

function render(entries: readonly Subscription[] = [entry()]) {
  const fixture = TestBed.createComponent(SubscriptionTable);
  fixture.componentRef.setInput('entries', entries);
  fixture.detectChanges();
  return fixture;
}

describe('SubscriptionTable', () => {
  it('heads the columns the design lists, right to left', () => {
    const headers = [...render().nativeElement.querySelectorAll('th')].map((th: HTMLElement) =>
      th.textContent?.trim(),
    );

    expect(headers.slice(1)).toEqual([
      'اسم الشركة /المتجر',
      'الباقة',
      'السعر',
      'تاريخ البدء',
      'تاريخ الانتهاء',
      'الحالة',
      'الإجراء',
    ]);
  });

  it('writes the price with its currency symbol after the number', () => {
    const fixture = render();

    expect(fixture.nativeElement.querySelector('[data-role="price"]').textContent.trim()).toBe(
      '12$',
    );
  });

  it('writes the dates with Latin digits and Arabic months', () => {
    const cell = render().nativeElement.querySelector('[data-role="started-on"]');

    expect(cell.textContent).toContain('يناير');
    expect(cell.textContent).toContain('2024');
  });

  it('shows the package and the status as pills', () => {
    const fixture = render();

    expect(fixture.nativeElement.querySelector('app-plan-pill')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-subscription-status-pill')).toBeTruthy();
  });

  it('ticks a row and asks for it by id', () => {
    const fixture = render();
    let toggled: string | null = null;
    fixture.componentInstance.rowToggle.subscribe((id: string) => (toggled = id));

    fixture.nativeElement.querySelectorAll('tbody input[type="checkbox"]')[0].click();

    expect(toggled).toBe('sub-1');
  });

  it('shows the empty message when nothing matched', () => {
    const fixture = TestBed.createComponent(SubscriptionTable);
    fixture.componentRef.setInput('entries', []);
    fixture.componentRef.setInput('hasNoResults', true);
    fixture.componentRef.setInput('emptyMessage', 'لا توجد نتائج');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('لا توجد نتائج');
  });
});
