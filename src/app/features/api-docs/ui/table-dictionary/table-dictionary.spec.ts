import { TestBed } from '@angular/core/testing';
import { TableDictionary } from './table-dictionary';

describe('TableDictionary', () => {
  it('lists every column with its type, null, key and note', () => {
    const fixture = TestBed.createComponent(TableDictionary);
    fixture.componentRef.setInput('table', {
      name: 'areas',
      description: 'An area inside a governorate.',
      servedAs: '/areas/{id}',
      columns: [
        { name: 'id', type: 'bigint unsigned', key: 'pk' },
        {
          name: 'governorate_id',
          type: 'bigint unsigned',
          key: 'fk',
          references: 'governorates.id',
          note: 'Restrict.',
        },
      ],
      indexes: ['UNIQUE (governorate_id, name_ar)'],
    });
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const cells = [...element.querySelectorAll('tbody tr')].map((row) =>
      [...row.querySelectorAll('td')].map((cell) => cell.textContent?.trim()),
    );

    expect(element.textContent).toContain('/areas/{id}');
    expect(cells[1]).toEqual([
      'governorate_id',
      'bigint unsigned',
      'no',
      'FK → governorates.id',
      'Restrict.',
    ]);
    expect(element.textContent).toContain('UNIQUE (governorate_id, name_ar)');
  });
});
