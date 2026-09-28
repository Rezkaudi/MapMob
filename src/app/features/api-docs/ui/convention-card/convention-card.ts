import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DocsSection } from '../../models/docs-section';
import { CodeBlock } from '../code-block/code-block';
import { DocsTable } from '../docs-table/docs-table';

@Component({
  selector: 'app-convention-card',
  imports: [CodeBlock, DocsTable],
  templateUrl: './convention-card.html',
  host: { class: 'block min-w-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConventionCard {
  readonly section = input.required<DocsSection>();
}
