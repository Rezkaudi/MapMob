import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AdContentType } from '../../models/ad-content-type';

/** The picture or clip the ad runs, or a note when nothing was uploaded. */
@Component({
  selector: 'app-ad-media-preview',
  templateUrl: './ad-media-preview.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdMediaPreview {
  readonly contentType = input.required<AdContentType>();
  readonly mediaUrl = input.required<string | null>();
  readonly title = input.required<string>();
}
