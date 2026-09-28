import { TestBed } from '@angular/core/testing';
import { DocsTable } from './docs-table';

describe('DocsTable', () => {
  it('draws the head and the rows', () => {
    const fixture = TestBed.createComponent(DocsTable);
    fixture.componentRef.setInput('table', {
      head: ['Status', 'When'],
      rows: [['401', 'No token']],
    });
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect([...element.querySelectorAll('th')].map((cell) => cell.textContent?.trim())).toEqual([
      'Status',
      'When',
    ]);
    expect([...element.querySelectorAll('td')].map((cell) => cell.textContent?.trim())).toEqual([
      '401',
      'No token',
    ]);
  });
});
