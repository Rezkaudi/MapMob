import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ApiFeature } from '../../models/api-feature';
import { DbDomain } from '../../models/db-domain';
import { docsNavGroups } from '../../state/docs-nav-groups';

@Component({
  selector: 'app-docs-sidebar',
  templateUrl: './docs-sidebar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsSidebar {
  readonly features = input.required<readonly ApiFeature[]>();
  readonly domains = input.required<readonly Pick<DbDomain, 'id' | 'name'>[]>();
  readonly activeId = input<string | null>(null);
  /** The page's own path, so each link reads e.g. /docs#conventions. */
  readonly pagePath = input('');
  readonly navigate = output<string>();

  protected readonly groups = computed(() => docsNavGroups(this.features(), this.domains()));

  protected follow(event: Event, id: string): void {
    event.preventDefault();
    this.navigate.emit(id);
  }
}
