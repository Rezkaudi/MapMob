import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TableSkeleton } from './table-skeleton';

@Component({
  imports: [TableSkeleton],
  template: `<table>
    <tbody app-table-skeleton [columnCount]="4" [rowCount]="3"></tbody>
  </table>`,
})
class HostComponent {}

describe('TableSkeleton', () => {
  it('draws a placeholder cell for every column of every row', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tr');
    expect(rows.length).toBe(3);
    expect(rows[0].querySelectorAll('td').length).toBe(4);
    expect(fixture.nativeElement.querySelectorAll('app-skeleton').length).toBe(12);
  });

  it('is hidden from assistive tech', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const body: HTMLElement = fixture.nativeElement.querySelector('tbody');
    expect(body.getAttribute('aria-hidden')).toBe('true');
  });
});
