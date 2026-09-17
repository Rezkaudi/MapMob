import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { ListSearchField } from '../../../../shared/ui/list-search-field/list-search-field';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { ContentPagesStore } from '../../state/content-pages.store';
import { ContentPageTable } from '../../ui/content-page-table/content-page-table';

@Component({
  selector: 'app-content-page-list',
  imports: [ContentPageTable, ErrorState, ListSearchField, PageHeader],
  templateUrl: './content-page-list.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageList {
  protected readonly store = inject(ContentPagesStore);

  constructor() {
    this.store.loadPages();
  }
}
