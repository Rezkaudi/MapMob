import { TestBed } from '@angular/core/testing';
import { FieldTable } from './field-table';

describe('FieldTable', () => {
  it('draws one row per field, with its name, type, need and notes', () => {
    const fixture = TestBed.createComponent(FieldTable);
    fixture.componentRef.setInput('fields', [
      {
        name: 'status',
        type: 'enum: active | suspended',
        isRequired: true,
        description: 'The new state.',
      },
      { name: 'search', type: 'string', isRequired: false, description: '' },
    ]);
    fixture.detectChanges();
    const rows = [...(fixture.nativeElement as HTMLElement).querySelectorAll('tbody tr')];

    expect(
      rows.map((row) => [...row.querySelectorAll('td')].map((cell) => cell.textContent?.trim())),
    ).toEqual([
      ['status', 'enum: active | suspended', 'required', 'The new state.'],
      ['search', 'string', 'optional', ''],
    ]);
  });
});
