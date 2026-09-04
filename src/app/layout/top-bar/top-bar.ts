import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SearchInput } from '../../shared/ui/search-input/search-input';
import { UserMenu } from '../user-menu/user-menu';

@Component({
  selector: 'app-top-bar',
  imports: [SearchInput, UserMenu],
  templateUrl: './top-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBar {
  readonly userName = input.required<string>();
  readonly userRole = input.required<string>();
  readonly avatarUrl = input<string | null>(null);
}
