import { TestBed } from '@angular/core/testing';
import { CategoryToolbar } from './category-toolbar';

const KIND_CHIPS = [
  { value: 'all', label: 'الكل', count: 20 },
  { value: 'main', label: 'التصنيفات الرئيسية', count: 6 },
  { value: 'sub', label: 'التصنيفات الفرعية', count: 15 },
];

function render() {
  const fixture = TestBed.createComponent(CategoryToolbar);
  fixture.componentRef.setInput('parentOptions', [{ value: 'm1', label: 'مطاعم' }]);
  fixture.componentRef.setInput('kindChips', KIND_CHIPS);
  fixture.componentRef.setInput('selectedKindChip', 'all');
  fixture.detectChanges();
  return fixture;
}

function selectsOf(element: HTMLElement): HTMLSelectElement[] {
  return Array.from(element.querySelectorAll('select'));
}

function optionLabels(select: HTMLSelectElement): string[] {
  return Array.from(select.options, (option) => option.text.trim());
}

describe('CategoryToolbar', () => {
  it('draws the search, then sort, status and main category filters in RTL order', () => {
    const element = render().nativeElement as HTMLElement;
    const [sort, status, parent] = selectsOf(element);

    expect((element.querySelector('input') as HTMLInputElement).placeholder).toBe(
      'ابحث برقم البلاغ أو اسم المكان...',
    );
    expect(optionLabels(sort)).toEqual(['ترتيب حسب', 'الأحدث', 'الأقدم', 'الاسم']);
    expect(optionLabels(status)).toEqual(['الحالة', 'نشط', 'معطل']);
    expect(optionLabels(parent)).toEqual(['التصنيف الرئيسي', 'مطاعم']);
  });

  it('draws the kind chips with their counts', () => {
    const chips = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('app-filter-chips button'),
      (chip) => chip.textContent?.replace(/\s+/g, ''),
    );

    expect(chips).toEqual(['الكل(20)', 'التصنيفاتالرئيسية(6)', 'التصنيفاتالفرعية(15)']);
  });

  it('reports the search, every filter and the chip', () => {
    const fixture = render();
    const component = fixture.componentInstance;
    const emitted: unknown[][] = [];
    component.searchChange.subscribe((value) => emitted.push(['search', value]));
    component.sortChange.subscribe((value) => emitted.push(['sort', value]));
    component.statusChange.subscribe((value) => emitted.push(['status', value]));
    component.parentChange.subscribe((value) => emitted.push(['parent', value]));
    component.kindChipChange.subscribe((value) => emitted.push(['chip', value]));
    const element = fixture.nativeElement as HTMLElement;

    const search = element.querySelector('input') as HTMLInputElement;
    search.value = 'مطاعم';
    search.dispatchEvent(new Event('input'));
    const [sort, status, parent] = selectsOf(element);
    for (const [select, value] of [
      [sort, 'name'],
      [status, 'suspended'],
      [parent, 'm1'],
    ] as const) {
      select.value = value;
      select.dispatchEvent(new Event('change'));
    }
    (element.querySelectorAll('app-filter-chips button')[2] as HTMLButtonElement).click();

    expect(emitted).toEqual([
      ['search', 'مطاعم'],
      ['sort', 'name'],
      ['status', 'suspended'],
      ['parent', 'm1'],
      ['chip', 'sub'],
    ]);
  });
});
