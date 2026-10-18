import { TestBed } from '@angular/core/testing';
import { toWinnerRow } from '../../state/winner-row';
import { buildWinner } from '../../testing/game-fixture';
import { GameWinnerList } from './game-winner-list';

describe('GameWinnerList', () => {
  function render(rows = [toWinnerRow(buildWinner({ deliveryStatus: 'pending' }))]) {
    const fixture = TestBed.createComponent(GameWinnerList);
    fixture.componentRef.setInput('rows', rows);
    fixture.componentRef.setInput('countText', '4 فائزين');
    fixture.detectChanges();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }

  it('lists each winner with the spelled-out prize', () => {
    const { element } = render();
    const texts = (selector: string) =>
      Array.from(element.querySelectorAll(selector))
        .map((cell) => cell.textContent?.trim())
        .filter(Boolean);
    expect(texts('th')).toEqual([
      'اسم الفائز',
      'رقم الهاتف/الايميل',
      'الجائزة المستحقة',
      'حالة تسليم الجائزة',
    ]);
    const cells = texts('tbody td');
    expect(cells).toEqual([
      'أحمد جمال',
      '093608934',
      'جائزة مالية بقيمة 50,000 ل.س',
      'بانتظار التسليم',
    ]);
  });

  it('searches by name or phone', () => {
    const { fixture, element } = render();
    let search = '';
    fixture.componentInstance.searchChange.subscribe((value) => (search = value));
    const input = element.querySelector('input') as HTMLInputElement;
    expect(input.placeholder).toBe('ابحث باسم الفائز أو برقم هاتفه....');
    input.value = 'أحمد';
    input.dispatchEvent(new Event('input'));
    expect(search).toBe('أحمد');
  });

  it('says when no winner matches', () => {
    const { element } = render([]);
    expect(element.textContent).toContain('لا يوجد فائزون مطابقون');
  });
});
