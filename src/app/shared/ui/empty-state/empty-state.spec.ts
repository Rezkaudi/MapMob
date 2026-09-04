import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EmptyState } from './empty-state';

@Component({
  imports: [EmptyState],
  template: `<app-empty-state title="لا توجد أماكن مضافة" description="ابدأ بإضافة أول مكان لك" />`,
})
class HostComponent {}

describe('EmptyState', () => {
  it('renders the title and description', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('لا توجد أماكن مضافة');
    expect(text).toContain('ابدأ بإضافة أول مكان لك');
  });
});
