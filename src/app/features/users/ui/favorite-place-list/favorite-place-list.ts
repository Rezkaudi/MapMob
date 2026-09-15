import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { FavoriteRow } from '../../state/user-detail-view';

@Component({
  selector: 'app-favorite-place-list',
  imports: [AppIcon],
  templateUrl: './favorite-place-list.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritePlaceList {
  readonly rows = input.required<readonly FavoriteRow[]>();
}
