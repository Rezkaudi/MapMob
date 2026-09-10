import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SectionPanel } from '../../../../../shared/ui/section-panel/section-panel';

@Component({
  selector: 'app-place-videos-card',
  imports: [SectionPanel],
  templateUrl: './place-videos-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceVideosCard {
  readonly videos = input.required<readonly string[]>();
}
