import { TestBed } from '@angular/core/testing';
import { toGameRow } from '../../state/game-row';
import { buildGame } from '../../testing/game-fixture';
import { GameTable } from './game-table';

const SCHEDULED = buildGame({ startsAt: '2025-10-15T17:00:00.000Z' });
const FINISHED = buildGame({ id: 'game-99', roundNumber: 99, status: 'finished' });

function render(options: { isLoading?: boolean; hasNoResults?: boolean } = {}) {
  const fixture = TestBed.createComponent(GameTable);
  fixture.componentRef.setInput('rows', [toGameRow(SCHEDULED), toGameRow(FINISHED)]);
  fixture.componentRef.setInput('isLoading', options.isLoading ?? false);
  fixture.componentRef.setInput('hasNoResults', options.hasNoResults ?? false);
  fixture.componentRef.setInput('emptyMessage', 'لا توجد ألعاب حتى الآن');
  fixture.detectChanges();
  const element: HTMLElement = fixture.nativeElement;
  return { fixture, element };
}

describe('GameTable', () => {
  it('heads the columns in the frame order, the name first on the right', () => {
    const { element } = render();
    const headers = Array.from(element.querySelectorAll('th')).map((th) => th.textContent?.trim());
    expect(headers).toEqual([
      'اسم اللعبة والمعرف',
      'موعد البدء',
      'عدد الأسئلة',
      'الجائزة المرصودة',
      'المشاركون',
      'الحالة',
      'الإجراء',
    ]);
  });

  it('writes each game as the frame does', () => {
    const { element } = render();
    const cells = Array.from(element.querySelectorAll('tbody tr')[0].querySelectorAll('td'));
    const lines = (cell: Element) =>
      Array.from(cell.querySelectorAll('span')).map((span) => span.textContent?.trim());
    expect(lines(cells[0])).toEqual(['الأكثرية والأقلية', 'الجولة #104']);
    expect(lines(cells[1])).toEqual(['15 أكتوبر 2025', '8:00 مساء']);
    expect(cells[2].textContent?.trim()).toBe('12');
    expect(cells[3].textContent?.trim()).toBe('50,000 ل.س');
    expect(cells[4].textContent?.trim()).toBe('214');
    expect(cells[5].textContent?.trim()).toBe('مجدولة');
  });

  it('opens a game from its menu', () => {
    const { fixture, element } = render();
    let opened = '';
    fixture.componentInstance.view.subscribe((game) => (opened = game.id));
    element
      .querySelectorAll('tbody tr')[1]
      .querySelector('app-game-row-menu button')
      ?.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    (
      element.querySelector('[data-testid="action-menu-panel"] button') as HTMLButtonElement
    ).click();
    expect(opened).toBe('game-99');
  });

  it('says why the table is empty', () => {
    const { element } = render({ hasNoResults: true });
    expect(element.textContent).toContain('لا توجد ألعاب حتى الآن');
  });

  it('opens a game from its name in the first column', () => {
    const { fixture, element } = render();
    let opened = '';
    fixture.componentInstance.view.subscribe((game) => (opened = game.id));
    const name = element.querySelectorAll('tbody tr')[1].querySelector('td button') as HTMLButtonElement;

    expect(name.getAttribute('aria-label')).toBe('عرض تفاصيل الأكثرية والأقلية — الجولة #99');
    name.click();

    expect(opened).toBe('game-99');
  });
});
