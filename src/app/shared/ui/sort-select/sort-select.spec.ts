import { TestBed } from '@angular/core/testing';
import { SortSelect } from './sort-select';

describe('SortSelect', () => {
  function render() {
    const fixture = TestBed.createComponent(SortSelect);
    fixture.detectChanges();
    return fixture;
  }

  it('offers the sort choices after the "ترتيب حسب" placeholder', () => {
    const element = render().nativeElement as HTMLElement;

    const options = Array.from(element.querySelectorAll('option'), (option) => option.text.trim());

    expect(options).toEqual(['ترتيب حسب', 'الأحدث', 'الأقدم', 'الاسم']);
  });

  it('reports the picked sort, and no sort for the placeholder', () => {
    const fixture = render();
    const sortChange = vi.fn();
    fixture.componentInstance.sortChange.subscribe(sortChange);
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;

    select.value = 'oldest';
    select.dispatchEvent(new Event('change'));
    select.value = '';
    select.dispatchEvent(new Event('change'));

    expect(sortChange.mock.calls).toEqual([['oldest'], [null]]);
  });
});
