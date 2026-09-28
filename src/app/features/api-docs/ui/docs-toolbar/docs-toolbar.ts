import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HTTP_METHODS, HttpMethod } from '../../models/http-method';

interface MethodChip {
  readonly value: HttpMethod | null;
  readonly label: string;
}

const METHOD_CHIPS: readonly MethodChip[] = [
  { value: null, label: 'All' },
  ...HTTP_METHODS.map((method) => ({ value: method, label: method })),
];

@Component({
  selector: 'app-docs-toolbar',
  templateUrl: './docs-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsToolbar {
  readonly search = input.required<string>();
  readonly methodFilter = input.required<HttpMethod | null>();
  readonly visibleCount = input.required<number>();
  readonly searchChange = output<string>();
  readonly methodFilterChange = output<HttpMethod | null>();
  readonly openAll = output<void>();
  readonly closeAll = output<void>();

  protected readonly chips = METHOD_CHIPS;

  protected readSearch(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
