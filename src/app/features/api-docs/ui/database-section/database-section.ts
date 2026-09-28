import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DbDomain } from '../../models/db-domain';
import { ErdDiagram } from '../erd-diagram/erd-diagram';
import { TableDictionary } from '../table-dictionary/table-dictionary';

@Component({
  selector: 'app-database-section',
  imports: [ErdDiagram, TableDictionary],
  templateUrl: './database-section.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatabaseSection {
  readonly domain = input.required<DbDomain>();
  readonly isPrinting = input(false);
}
