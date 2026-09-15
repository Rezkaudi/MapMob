import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

/** The 390×40 search box on the right of the regions and users toolbars. */
@Component({
  selector: 'app-list-search-field',
  imports: [AppIcon],
  templateUrl: './list-search-field.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListSearchField {
  readonly placeholder = input.required<string>();
  readonly searchChange = output<string>();

  protected onSearchInput(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
