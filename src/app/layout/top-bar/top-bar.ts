import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideBell, LucideChevronDown } from '@lucide/angular';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { SearchInput } from '../../shared/ui/search-input/search-input';

@Component({
  selector: 'app-top-bar',
  imports: [Avatar, SearchInput, LucideBell, LucideChevronDown],
  templateUrl: './top-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBar {
  readonly userName = input.required<string>();
  readonly userRole = input.required<string>();
  readonly avatarUrl = input<string | null>(null);
}
