import { TestBed } from '@angular/core/testing';
import { toWinnerRow } from '../../state/winner-row';
import { buildWinner } from '../../testing/game-fixture';
import { WinnerTable } from './winner-table';

function render() {
  const fixture = TestBed.createComponent(WinnerTable);
  fixture.componentRef.setInput('rows', [
    toWinnerRow(buildWinner()),
    toWinnerRow(buildWinner({ id: 'winner-2', deliveryStatus: 'pending' })),
  ]);
  fixture.detectChanges();
  const element: HTMLElement = fixture.nativeElement;
  return { fixture, element };
}

describe('WinnerTable', () => {
  it('heads the columns in the frame order', () => {
    const { element } = render();
    expect(Array.from(element.querySelectorAll('th')).map((th) => th.textContent?.trim())).toEqual([
      'الفائز',
      'رقم الهاتف',
      'رقم الجائزة',
      'الجائزة',
      'تاريخ الفوز',
      'حالة الجائزة',
      'الإجراء',
    ]);
  });

  it('writes each winner as the frame does', () => {
    const { element } = render();
    const cells = Array.from(element.querySelectorAll('tbody tr')[1].querySelectorAll('td')).map(
      (cell) => cell.textContent?.trim(),
    );
    expect(cells.slice(0, 6)).toEqual([
      'أحمد جمال',
      '093608934',
      '#104',
      '50,000 ل.س',
      '16/1/2023',
      'بانتظار التسليم',
    ]);
  });

  it('asks to change a prize status from the row menu', () => {
    const { fixture, element } = render();
    let picked = '';
    fixture.componentInstance.statusChange.subscribe((winner) => (picked = winner.id));
    (
      element
        .querySelectorAll('tbody tr')[1]
        .querySelector('app-winner-row-menu button') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    const items = element.querySelectorAll('[data-testid="action-menu-panel"] button');
    (items[1] as HTMLButtonElement).click();
    expect(picked).toBe('winner-2');
  });

  it('opens the details from the winner name in the first column', () => {
    const { fixture, element } = render();
    let opened = '';
    fixture.componentInstance.view.subscribe((winner) => (opened = winner.id));
    const name = element.querySelectorAll('tbody tr')[1].querySelector('td button') as HTMLButtonElement;

    expect(name.getAttribute('aria-label')).toBe('عرض تفاصيل الفائز أحمد جمال');
    name.click();

    expect(opened).toBe('winner-2');
  });
});
