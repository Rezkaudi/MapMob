import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  TemplateRef,
  computed,
  contentChild,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ListSort } from '../../models/list-sort';
import { AppIcon } from '../app-icon/app-icon';
import { ListSearchField } from '../list-search-field/list-search-field';
import { SortSelect } from '../sort-select/sort-select';

const FILTER_LABEL = 'الفلاتر';
const DEFAULT_CONTROL_GAP_PX = 16;

export interface FilterPanelContext {
  readonly close: () => void;
}

/**
 * The search, sort and "الفلاتر" bar of the list pages. Each page passes its own panel as an
 * `<ng-template let-close="close">`, so the panel is only created while it is open.
 */
@Component({
  selector: 'app-filter-toolbar',
  imports: [AppIcon, ListSearchField, NgTemplateOutlet, SortSelect],
  templateUrl: './filter-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterToolbar {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly searchPlaceholder = input.required<string>();
  readonly panelId = input.required<string>();
  readonly activeFilterCount = input<number>(0);
  readonly controlGap = input<number>(DEFAULT_CONTROL_GAP_PX);
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();

  protected readonly filterPanel = contentChild.required(TemplateRef<FilterPanelContext>);
  protected readonly isFilterPanelOpen = signal(false);
  protected readonly panelContext: FilterPanelContext = { close: () => this.closeFilterPanel() };
  protected readonly filterButtonLabel = computed(() =>
    this.activeFilterCount() > 0 ? `${FILTER_LABEL}، ${this.activeFilterCount()} مفعلة` : null,
  );

  protected toggleFilterPanel(): void {
    this.isFilterPanelOpen.update((isOpen) => !isOpen);
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
