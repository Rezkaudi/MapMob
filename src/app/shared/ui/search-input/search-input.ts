import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

@Component({
  selector: 'app-search-input',
  imports: [AppIcon],
  templateUrl: './search-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInput {
  readonly placeholder = input<string>('');
  readonly queryChange = output<string>();

  protected onInput(event: Event): void {
    this.queryChange.emit((event.target as HTMLInputElement).value);
  }
}
