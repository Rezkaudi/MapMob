import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ChipOption } from './chip-option';

@Component({
  selector: 'app-filter-chips',
  templateUrl: './filter-chips.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterChips {
  readonly options = input.required<readonly ChipOption[]>();
  readonly selected = input<string>('');
  readonly selectedChange = output<string>();
}
