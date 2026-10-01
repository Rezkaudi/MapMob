import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { StoryStatus } from '../../../../shared/models/story-status';
import { ChipOption } from '../../../../shared/ui/filter-chips/chip-option';
import { FilterChips } from '../../../../shared/ui/filter-chips/filter-chips';
import { ListSearchField } from '../../../../shared/ui/list-search-field/list-search-field';
import { ALL_STORIES_CHIP } from '../../state/story-status-chips';

/** The white card over the table: the store search and the status chips. */
@Component({
  selector: 'app-story-filter-bar',
  imports: [FilterChips, ListSearchField],
  templateUrl: './story-filter-bar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryFilterBar {
  readonly chips = input.required<readonly ChipOption[]>();
  readonly selectedChip = input<string>(ALL_STORIES_CHIP);
  readonly searchChange = output<string>();
  /** `null` is the "الكل" chip: every status. */
  readonly statusChange = output<StoryStatus | null>();

  protected pickChip(value: string): void {
    this.statusChange.emit(value === ALL_STORIES_CHIP ? null : (value as StoryStatus));
  }
}
