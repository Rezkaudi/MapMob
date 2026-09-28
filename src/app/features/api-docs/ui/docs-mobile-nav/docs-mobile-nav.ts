import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ApiFeature } from '../../models/api-feature';
import { DbDomain } from '../../models/db-domain';
import { docsNavGroups } from '../../state/docs-nav-groups';

/** The sidebar's links as one picker, for screens too narrow for the sidebar. */
@Component({
  selector: 'app-docs-mobile-nav',
  templateUrl: './docs-mobile-nav.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsMobileNav {
  readonly features = input.required<readonly ApiFeature[]>();
  readonly domains = input.required<readonly Pick<DbDomain, 'id' | 'name'>[]>();
  readonly activeId = input<string | null>(null);
  readonly navigate = output<string>();

  protected readonly groups = computed(() => docsNavGroups(this.features(), this.domains()));

  protected pick(event: Event): void {
    this.navigate.emit((event.target as HTMLSelectElement).value);
  }
}
