import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TablePagination } from './table-pagination';

@Component({
  imports: [TablePagination],
  template: `<app-table-pagination
    [pageIndex]="pageIndex()"
    [pageSize]="pageSize()"
    [totalCount]="totalCount()"
    (pageIndexChange)="onPageChange($event)"
  />`,
})
class HostComponent {
  readonly pageIndex = signal(0);
  readonly pageSize = signal(20);
  readonly totalCount = signal(3000);
  lastRequestedPage: number | null = null;
  onPageChange(pageIndex: number): void {
    this.lastRequestedPage = pageIndex;
  }
}

function createHost() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  return fixture;
}

/** The page buttons and ellipsis gaps, in the order they are drawn. */
function pageLabels(fixture: ReturnType<typeof createHost>): string[] {
  return fixture.debugElement
    .queryAll(By.css('[data-role="page-step"], [data-role="page-gap"]'))
    .map((step) => step.nativeElement.textContent.trim());
}

function currentPageLabel(fixture: ReturnType<typeof createHost>): string | null {
  const current = fixture.debugElement.query(By.css('[aria-current="page"]'));
  return current ? current.nativeElement.textContent.trim() : null;
}

describe('TablePagination', () => {
  it('shows the visible range and total count', () => {
    const fixture = createHost();

    expect(fixture.nativeElement.textContent).toContain('1');
    expect(fixture.nativeElement.textContent).toContain('20');
    expect(fixture.nativeElement.textContent).toContain('3000');
  });

  it('emits the next page index when "التالي" is clicked', () => {
    const fixture = createHost();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const next = buttons.find((b) => b.nativeElement.textContent.includes('التالي'));
    next!.nativeElement.click();

    expect(fixture.componentInstance.lastRequestedPage).toBe(1);
  });

  it('disables "السابق" on the first page', () => {
    const fixture = createHost();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const previous = buttons.find((b) => b.nativeElement.textContent.includes('السابق'));

    expect(previous!.nativeElement.disabled).toBe(true);
  });

  it('lists every page when they all fit', () => {
    const fixture = createHost();
    fixture.componentInstance.totalCount.set(100);
    fixture.detectChanges();

    expect(pageLabels(fixture)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('keeps the current page reachable in the middle of a long list', () => {
    const fixture = createHost();
    fixture.componentInstance.pageIndex.set(74);
    fixture.detectChanges();

    expect(pageLabels(fixture)).toEqual(['1', '…', '74', '75', '76', '…', '150']);
  });

  it('marks the current page even when it is not among the first pages', () => {
    const fixture = createHost();
    fixture.componentInstance.pageIndex.set(74);
    fixture.detectChanges();

    expect(currentPageLabel(fixture)).toBe('75');
  });

  it('keeps the last page reachable from the first page', () => {
    const fixture = createHost();

    expect(pageLabels(fixture).at(-1)).toBe('150');
  });

  it('goes to the page whose number is clicked', () => {
    const fixture = createHost();
    fixture.componentInstance.pageIndex.set(74);
    fixture.detectChanges();

    const lastPage = fixture.debugElement
      .queryAll(By.css('[data-role="page-step"]'))
      .at(-1)!.nativeElement;
    lastPage.click();

    expect(fixture.componentInstance.lastRequestedPage).toBe(149);
  });

  it('shows a single page when there is nothing to page through', () => {
    const fixture = createHost();
    fixture.componentInstance.totalCount.set(0);
    fixture.detectChanges();

    expect(pageLabels(fixture)).toEqual(['1']);
  });
});
