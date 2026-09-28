import { TestBed } from '@angular/core/testing';
import { DbDomain } from '../../models/db-domain';
import { WholeErd } from './whole-erd';

const domain: DbDomain = {
  id: 'db-whole',
  name: 'Complete ERD',
  description: '',
  layout: [['governorates'], ['places']],
  tables: [
    {
      name: 'governorates',
      description: '',
      servedAs: '',
      columns: [{ name: 'id', type: 'bigint', key: 'pk' }],
    },
    {
      name: 'places',
      description: '',
      servedAs: '',
      columns: [
        { name: 'id', type: 'bigint', key: 'pk' },
        { name: 'name', type: 'varchar(150)' },
        { name: 'governorate_id', type: 'bigint', key: 'fk', references: 'governorates.id' },
      ],
    },
  ],
};

function render() {
  const fixture = TestBed.createComponent(WholeErd);
  fixture.componentRef.setInput('domain', domain);
  fixture.detectChanges();
  return fixture;
}

function svgOf(fixture: ReturnType<typeof render>): SVGSVGElement {
  return fixture.nativeElement.querySelector('svg');
}

describe('WholeErd', () => {
  it('draws every table and every link in one diagram', () => {
    const element: HTMLElement = render().nativeElement;

    expect(element.querySelectorAll('[data-erd-table]')).toHaveLength(2);
    expect(element.querySelectorAll('[data-erd-link]')).toHaveLength(1);
  });

  it('can show the key columns only', () => {
    const fixture = render();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[data-keys-only]');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(fixture.nativeElement.textContent).not.toContain('name');
  });

  it('fits the whole drawing into the frame at first', () => {
    expect(svgOf(render()).getAttribute('width')).toBe('100%');
  });

  it('zooms the drawing without changing what it shows', () => {
    const fixture = render();
    fixture.nativeElement.querySelector('[data-zoom="100"]').click();
    fixture.detectChanges();
    const fullWidth = Number(svgOf(fixture).getAttribute('width'));

    fixture.nativeElement.querySelector('[data-zoom="50"]').click();
    fixture.detectChanges();

    expect(Number(svgOf(fixture).getAttribute('width'))).toBe(fullWidth / 2);
  });
});
