import { TestBed } from '@angular/core/testing';
import { GameRowMenu } from './game-row-menu';

function openMenu(canChange: boolean) {
  const fixture = TestBed.createComponent(GameRowMenu);
  fixture.componentRef.setInput('canChange', canChange);
  fixture.detectChanges();
  fixture.nativeElement.querySelector('button').click();
  fixture.detectChanges();
  const items: HTMLButtonElement[] = Array.from(
    fixture.nativeElement.querySelectorAll('[data-testid="action-menu-panel"] button'),
  );
  return { fixture, items };
}

describe('GameRowMenu', () => {
  it('offers view, edit and delete for a game that has not finished', () => {
    const { items } = openMenu(true);
    expect(items.map((item) => item.textContent?.trim())).toEqual([
      'عرض التفاصيل',
      'تعديل',
      'حذف اللعبة',
    ]);
  });

  it('offers only the details of a finished game', () => {
    const { items } = openMenu(false);
    expect(items.map((item) => item.textContent?.trim())).toEqual(['عرض التفاصيل']);
  });

  it('tells which item was picked', () => {
    const { fixture, items } = openMenu(true);
    const picked: string[] = [];
    fixture.componentInstance.view.subscribe(() => picked.push('view'));
    fixture.componentInstance.edit.subscribe(() => picked.push('edit'));
    fixture.componentInstance.remove.subscribe(() => picked.push('remove'));
    items.forEach((item) => item.click());
    expect(picked).toEqual(['view', 'edit', 'remove']);
  });
});
