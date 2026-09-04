import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TablePagination } from './table-pagination';

@Component({
  imports: [TablePagination],
  template: `<app-table-pagination
    [pageIndex]="pageIndex"
    [pageSize]="20"
    [totalCount]="3000"
    (pageIndexChange)="onPageChange($event)"
  />`,
})
class HostComponent {
  pageIndex = 0;
  lastRequestedPage: number | null = null;
  onPageChange(pageIndex: number): void {
    this.lastRequestedPage = pageIndex;
  }
}

describe('TablePagination', () => {
  it('shows the visible range and total count', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('1');
    expect(fixture.nativeElement.textContent).toContain('20');
    expect(fixture.nativeElement.textContent).toContain('3000');
  });

  it('emits the next page index when "التالي" is clicked', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const next = buttons.find((b) => b.nativeElement.textContent.includes('التالي'));
    next!.nativeElement.click();

    expect(fixture.componentInstance.lastRequestedPage).toBe(1);
  });

  it('disables "السابق" on the first page', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const previous = buttons.find((b) => b.nativeElement.textContent.includes('السابق'));

    expect(previous!.nativeElement.disabled).toBe(true);
  });
});
