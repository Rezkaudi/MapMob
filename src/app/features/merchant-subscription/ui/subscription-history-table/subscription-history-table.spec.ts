import { TestBed } from '@angular/core/testing';
import { buildHistoryRows } from '../../state/history-rows';
import { FREE_RECORD, buildOverview } from '../../testing/merchant-subscription-fixture';
import { SubscriptionHistoryTable } from './subscription-history-table';

function render() {
  const fixture = TestBed.createComponent(SubscriptionHistoryTable);
  fixture.componentRef.setInput('rows', buildHistoryRows(buildOverview().history));
  fixture.detectChanges();
  return fixture;
}

describe('SubscriptionHistoryTable', () => {
  it('heads the card and the seven columns, plan first so RTL puts it on the right', () => {
    const element: HTMLElement = render().nativeElement;

    expect(element.querySelector('app-section-heading h2')?.textContent?.trim()).toBe(
      'سجل الاشتراكات',
    );
    expect(Array.from(element.querySelectorAll('th'), (cell) => cell.textContent?.trim())).toEqual([
      'الباقة',
      'المدة',
      'المبلغ',
      'تاريخ الاشتراك',
      'تاريخ الانتهاء',
      'الحالة',
      'الإجراءات',
    ]);
  });

  it('writes one row per period', () => {
    const rows = render().nativeElement.querySelectorAll('tbody tr');
    const cells = Array.from(rows[1].querySelectorAll('td'), (cell: Element) =>
      cell.textContent?.trim(),
    );

    expect(rows).toHaveLength(2);
    expect(cells.slice(0, 6)).toEqual([
      'الباقة المجانية',
      'شهرية',
      '0 ل.س',
      '01 / 08 / 2026',
      '01 / 09 / 2026',
      'منتهية',
    ]);
  });

  it('asks for the details of the row whose button was pressed', () => {
    const fixture = render();
    const view = vi.fn();
    fixture.componentInstance.view.subscribe(view);

    fixture.nativeElement.querySelectorAll('tbody tr')[1].querySelector('button').click();

    expect(view).toHaveBeenCalledWith(FREE_RECORD);
  });
});
