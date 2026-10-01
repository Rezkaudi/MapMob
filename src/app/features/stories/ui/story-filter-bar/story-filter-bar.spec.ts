import { TestBed } from '@angular/core/testing';
import { buildStorySummary } from '../../testing/story-fixture';
import { buildStoryStatusChips } from '../../state/story-status-chips';
import { StoryFilterBar } from './story-filter-bar';

function render(selectedChip = 'all') {
  const fixture = TestBed.createComponent(StoryFilterBar);
  fixture.componentRef.setInput('chips', buildStoryStatusChips(buildStorySummary()));
  fixture.componentRef.setInput('selectedChip', selectedChip);
  const searches: string[] = [];
  const statuses: (string | null)[] = [];
  fixture.componentInstance.searchChange.subscribe((search) => searches.push(search));
  fixture.componentInstance.statusChange.subscribe((status) => statuses.push(status));
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, searches, statuses };
}

const chipsOf = (element: HTMLElement) => [
  ...element.querySelectorAll<HTMLButtonElement>('app-filter-chips button'),
];

/** Angular drops the space between a chip's label and count, so each is read on its own. */
const wordsOf = (chip: HTMLButtonElement) =>
  [...chip.querySelectorAll('span')]
    .map((part) => part.textContent?.trim())
    .filter(Boolean)
    .join(' ');

describe('StoryFilterBar', () => {
  it('puts the store search over the four status chips, 24px apart', () => {
    const { element } = render();
    const card = element.firstElementChild!;

    expect(card.classList).toContain('gap-6');
    expect(card.firstElementChild?.tagName).toBe('APP-LIST-SEARCH-FIELD');
    expect(element.querySelector('input')?.placeholder).toBe('ابحث عن متجر...');
    expect(chipsOf(element).map(wordsOf)).toEqual([
      'الكل (124)',
      'نشطة (10)',
      'مخفية (1)',
      'منتهية (21)',
    ]);
  });

  it('keeps the search 390px wide at most, as the frame draws it', () => {
    const search = render().element.querySelector('app-list-search-field')!;

    expect(search.classList).toContain('max-w-[390px]');
  });

  it('marks the picked chip', () => {
    const [all, , hidden] = chipsOf(render('hidden').element);

    expect(all.getAttribute('aria-pressed')).toBe('false');
    expect(hidden.getAttribute('aria-pressed')).toBe('true');
  });

  it('reports the typed search', () => {
    const { element, searches } = render();
    const input = element.querySelector('input')!;

    input.value = 'كافيه';
    input.dispatchEvent(new Event('input'));

    expect(searches).toEqual(['كافيه']);
  });

  it('reports a status chip as its status and "الكل" as no filter', () => {
    const { element, statuses } = render();
    const [all, active] = chipsOf(element);

    active.click();
    all.click();

    expect(statuses).toEqual(['active', null]);
  });
});
