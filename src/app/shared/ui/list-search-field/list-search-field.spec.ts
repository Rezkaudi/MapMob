import { TestBed } from '@angular/core/testing';
import { ListSearchField } from './list-search-field';

describe('ListSearchField', () => {
  function render() {
    const fixture = TestBed.createComponent(ListSearchField);
    fixture.componentRef.setInput('placeholder', 'ابحث عن مستخدم...');
    fixture.detectChanges();
    return fixture;
  }

  it('labels the field with its placeholder', () => {
    const input = render().nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.placeholder).toBe('ابحث عن مستخدم...');
    expect(input.getAttribute('aria-label')).toBe('ابحث عن مستخدم...');
  });

  it('reports what the user types', () => {
    const fixture = render();
    const searchChange = vi.fn();
    fixture.componentInstance.searchChange.subscribe(searchChange);
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.value = 'أحمد';
    input.dispatchEvent(new Event('input'));

    expect(searchChange).toHaveBeenCalledWith('أحمد');
  });
});
