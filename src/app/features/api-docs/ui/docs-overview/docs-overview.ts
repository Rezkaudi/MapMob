import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpMethod } from '../../models/http-method';
import { MethodBadge } from '../method-badge/method-badge';

const METHOD_MEANING: readonly { readonly method: HttpMethod; readonly meaning: string }[] = [
  { method: 'GET', meaning: 'Read. Never changes data.' },
  { method: 'POST', meaning: 'Create, or an action like pause.' },
  { method: 'PUT', meaning: 'Replace a whole record.' },
  { method: 'PATCH', meaning: 'Change one small thing.' },
  { method: 'DELETE', meaning: 'Remove a record.' },
];

@Component({
  selector: 'app-docs-overview',
  imports: [MethodBadge],
  templateUrl: './docs-overview.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsOverview {
  protected readonly methods = METHOD_MEANING;
}
