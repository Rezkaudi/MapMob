import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SearchInput } from './search-input';

@Component({
  imports: [SearchInput],
  template: `<app-search-input placeholder="ابحث عن مستخدم..." (queryChange)="onChange($event)" />`,
})
class HostComponent {
  lastQuery = '';
  onChange(query: string): void {
    this.lastQuery = query;
  }
}

describe('SearchInput', () => {
  it('shows the placeholder', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.placeholder).toBe('ابحث عن مستخدم...');
  });

  it('emits queryChange as the user types', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.value = 'أحمد';
    input.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.lastQuery).toBe('أحمد');
  });
});
