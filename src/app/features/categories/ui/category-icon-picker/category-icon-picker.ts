import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { CategoryIcon, searchCategoryIcons } from '../../models/category-icon';

@Component({
  selector: 'app-category-icon-picker',
  imports: [AppIcon, LucideDynamicIcon],
  templateUrl: './category-icon-picker.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryIconPicker {
  readonly value = input.required<CategoryIcon>();
  /** The picked swatch, so the chosen icon previews in the colour it will be saved with. */
  readonly color = input.required<string>();
  readonly valueChange = output<CategoryIcon>();

  protected readonly search = signal('');
  protected readonly options = computed(() => searchCategoryIcons(this.search()));

  protected onSearchInput(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }
}
