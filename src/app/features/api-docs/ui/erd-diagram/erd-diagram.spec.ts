import { TestBed } from '@angular/core/testing';
import { DbDomain } from '../../models/db-domain';
import { ErdDiagram } from './erd-diagram';

const domain: DbDomain = {
  id: 'db-locations',
  name: 'Locations',
  description: '',
  layout: [['governorates'], ['areas']],
  tables: [
    {
      name: 'governorates',
      description: '',
      servedAs: '',
      columns: [{ name: 'id', type: 'bigint unsigned', key: 'pk' }],
    },
    {
      name: 'areas',
      description: '',
      servedAs: '',
      columns: [
        { name: 'id', type: 'bigint unsigned', key: 'pk' },
        {
          name: 'governorate_id',
          type: 'bigint unsigned',
          key: 'fk',
          references: 'governorates.id',
        },
        {
          name: 'place_id',
          type: 'bigint unsigned',
          key: 'fk',
          references: 'places.id',
          isNullable: true,
        },
      ],
    },
  ],
};

function render(): HTMLElement {
  const fixture = TestBed.createComponent(ErdDiagram);
  fixture.componentRef.setInput('domain', domain);
  fixture.detectChanges();
  return fixture.nativeElement;
}

describe('ErdDiagram', () => {
  it('draws one card per table and one line per key inside the diagram', () => {
    const element = render();

    expect(element.querySelectorAll('[data-erd-table]')).toHaveLength(2);
    expect(element.querySelectorAll('[data-erd-link]')).toHaveLength(1);
  });

  it('names the diagram for screen readers', () => {
    expect(render().querySelector('svg')?.getAttribute('aria-label')).toContain('Locations');
  });

  it('marks a key that points outside the diagram with its target table', () => {
    expect(render().textContent).toContain('→ places');
  });
});
