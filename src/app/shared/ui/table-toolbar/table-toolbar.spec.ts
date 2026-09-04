import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TableToolbar } from './table-toolbar';

@Component({
  imports: [TableToolbar],
  template: `<app-table-toolbar
    searchPlaceholder="ابحث عن مستخدم..."
    (queryChange)="onQuery($event)"
  />`,
})
class HostComponent {
  lastQuery = '';
  onQuery(query: string): void {
    this.lastQuery = query;
  }
}

describe('TableToolbar', () => {
  it('renders the search, sort and filter controls from the design', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('ترتيب حسب');
    expect(text).toContain('الفلاتر');
    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).placeholder).toBe(
      'ابحث عن مستخدم...',
    );
  });

  it('emits the typed query', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.value = 'أحمد';
    input.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.lastQuery).toBe('أحمد');
  });
});
