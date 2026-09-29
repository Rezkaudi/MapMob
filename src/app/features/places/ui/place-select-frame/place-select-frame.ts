import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** A native select with the frame's filled chevron on its left, in the room the field leaves. */
@Component({
  selector: 'app-place-select-frame',
  imports: [AppIcon],
  templateUrl: './place-select-frame.html',
  host: { class: 'relative block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceSelectFrame {}
