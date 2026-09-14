import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ListSort } from '../../../../shared/models/list-sort';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ListSearchField } from '../../../../shared/ui/list-search-field/list-search-field';
import { SortSelect } from '../../../../shared/ui/sort-select/sort-select';
import { UserFilters } from '../../models/user-filters';
import { UserFilterPanel } from '../user-filter-panel/user-filter-panel';

const FILTER_LABEL = 'الفلاتر';

@Component({
  selector: 'app-user-toolbar',
  imports: [AppIcon, ListSearchField, SortSelect, UserFilterPanel],
  templateUrl: './user-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserToolbar {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly filters = input.required<UserFilters>();
  readonly activeFilterCount = input<number>(0);
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
  readonly filtersApply = output<UserFilters>();

  /** View state only: whether the popover is showing. */
  protected readonly isFilterPanelOpen = signal(false);
  protected readonly filterButtonLabel = computed(() =>
    this.activeFilterCount() > 0 ? `${FILTER_LABEL}، ${this.activeFilterCount()} مفعلة` : null,
  );

  protected toggleFilterPanel(): void {
    this.isFilterPanelOpen.update((isOpen) => !isOpen);
  }

  protected applyFilters(filters: UserFilters): void {
    this.filtersApply.emit(filters);
    this.closeFilterPanel();
  }

  @HostListener('document:keydown.escape')
  protected closeFilterPanel(): void {
    this.isFilterPanelOpen.set(false);
  }

  /** The path is read at dispatch time, so a pick that re-renders the panel still counts as inside. */
  @HostListener('document:click', ['$event'])
  protected closeWhenClickingOutside(event: Event): void {
    if (!event.composedPath().includes(this.elementRef.nativeElement)) {
      this.closeFilterPanel();
    }
  }
}
