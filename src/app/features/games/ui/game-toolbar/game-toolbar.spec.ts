import { TestBed } from '@angular/core/testing';
import { buildGameStatusChips } from '../../state/game-status-chips';
import { buildSummary } from '../../testing/game-fixture';
import { GameToolbar } from './game-toolbar';

describe('GameToolbar', () => {
  function render() {
    const fixture = TestBed.createComponent(GameToolbar);
    fixture.componentRef.setInput('chips', buildGameStatusChips(buildSummary()));
    fixture.componentRef.setInput('selectedChip', 'all');
    fixture.detectChanges();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }

  it('searches by round number', () => {
    const { fixture, element } = render();
    let search = '';
    fixture.componentInstance.searchChange.subscribe((value) => (search = value));
    const input = element.querySelector('input[type="search"]') as HTMLInputElement;
    expect(input.placeholder).toBe('ابحث برقم الجولة....');
    input.value = '104';
    input.dispatchEvent(new Event('input'));
    expect(search).toBe('104');
  });

  it('turns the "الكل" chip into no status filter', () => {
    const { fixture, element } = render();
    const picked: (string | null)[] = [];
    fixture.componentInstance.statusChange.subscribe((status) => picked.push(status));
    const chips = element.querySelectorAll('app-filter-chips button');
    (chips[2] as HTMLButtonElement).click();
    (chips[0] as HTMLButtonElement).click();
    expect(picked).toEqual(['finished', null]);
  });
});
