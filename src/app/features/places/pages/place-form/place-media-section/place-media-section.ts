import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PICTURE_RULES } from '../../../../../shared/files/picture-rules';
import { VIDEO_RULES } from '../../../../../shared/files/video-rules';
import { FormSection } from '../../../../../shared/ui/form-section/form-section';
import { MediaFile } from '../../../../../shared/ui/media-picker/media-file';
import { MediaPicker } from '../../../../../shared/ui/media-picker/media-picker';
import { PackageQuotaBadge } from '../../../../../shared/ui/package-quota-badge/package-quota-badge';
import { PackageMediaLimit } from '../../../models/package-media-limit';

@Component({
  selector: 'app-place-media-section',
  imports: [FormSection, MediaPicker, PackageQuotaBadge],
  templateUrl: './place-media-section.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceMediaSection {
  readonly images = input.required<readonly MediaFile[]>();
  readonly videos = input.required<readonly MediaFile[]>();
  readonly limit = input.required<PackageMediaLimit>();
  readonly packageLabel = input.required<string>();
  readonly imagesChange = output<readonly MediaFile[]>();
  readonly videosChange = output<readonly MediaFile[]>();

  protected readonly imageRules = PICTURE_RULES;
  protected readonly videoRules = VIDEO_RULES;
}
