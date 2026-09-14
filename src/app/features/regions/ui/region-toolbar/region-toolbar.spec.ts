import { TestBed } from '@angular/core/testing';
import { RegionToolbar } from './region-toolbar';

describe('RegionToolbar', () => {
  function render() {
    const fixture = TestBed.createComponent(RegionToolbar);
    fixture.componentRef.setInput('searchPlaceholder', 'ابحث عن محافظة...');
    fixture.detectChanges();
    return fixture;
  }

  it('shows the search placeholder and the sort choices', () => {
    const element = render().nativeElement as HTMLElement;

    const search = element.querySelector('input') as HTMLInputElement;
    const options = Array.from(element.querySelectorAll('option')).map((option) =>
      option.text.trim(),
    );
    expect(search.placeholder).toBe('ابحث عن محافظة...');
    expect(options).toEqual(['ترتيب حسب', 'الأحدث', 'الأقدم', 'الاسم']);
  });

  it('reports what the user types', () => {
    const fixture = render();
    const searchChange = vi.fn();
    fixture.componentInstance.searchChange.subscribe(searchChange);

    const search = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    search.value = 'حمص';
    search.dispatchEvent(new Event('input'));

    expect(searchChange).toHaveBeenCalledWith('حمص');
  });

  it('reports the picked sort, and no sort for the placeholder', () => {
    const fixture = render();
    const sortChange = vi.fn();
    fixture.componentInstance.sortChange.subscribe(sortChange);
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;

    select.value = 'name';
    select.dispatchEvent(new Event('change'));
    select.value = '';
    select.dispatchEvent(new Event('change'));

    expect(sortChange.mock.calls).toEqual([['name'], [null]]);
  });
});
