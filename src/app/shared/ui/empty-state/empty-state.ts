import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BackButton } from '../back-button/back-button';

@Component({
  selector: 'app-empty-state',
  imports: [BackButton],
  templateUrl: './empty-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly description = input<string>('');
}
