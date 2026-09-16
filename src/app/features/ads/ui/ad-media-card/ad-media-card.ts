import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PICTURE_RULES } from '../../../../shared/files/picture-rules';
import { VIDEO_RULES } from '../../../../shared/files/video-rules';
import { FormCard } from '../../../../shared/ui/form-card/form-card';
import { FileRules } from '../../../../shared/ui/media-picker/file-rules';
import { FORM_CONTROL_CLASSES } from '../../../../shared/ui/form-field/form-control-classes';
import { FormField } from '../../../../shared/ui/form-field/form-field';
import { ImageUploadField } from '../../../../shared/ui/image-upload-field/image-upload-field';
import { UploadedImage } from '../../../../shared/ui/image-upload-field/uploaded-image';
import { OptionCard } from '../../../../shared/ui/option-card/option-card';
import { AdContentType } from '../../models/ad-content-type';
import { AdFormGroup } from '../../state/ad-form-group';
import { CONTENT_TYPE_CARDS } from '../ad-form-choices';

@Component({
  selector: 'app-ad-media-card',
  imports: [FormCard, FormField, ImageUploadField, OptionCard, ReactiveFormsModule],
  templateUrl: './ad-media-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdMediaCard {
  readonly form = input.required<AdFormGroup>();
  readonly media = input<UploadedImage | null>(null);
  readonly mediaChange = output<UploadedImage | null>();

  protected readonly contentTypeCards = CONTENT_TYPE_CARDS;
  protected readonly controlClasses = FORM_CONTROL_CLASSES;

  protected get uploadRules(): FileRules {
    return this.form().controls.contentType.value === 'video' ? VIDEO_RULES : PICTURE_RULES;
  }

  protected pickContentType(contentType: AdContentType): void {
    const control = this.form().controls.contentType;
    if (control.value === contentType) {
      return;
    }
    control.setValue(contentType);
    // A picture does not fit a video ad, or the other way round.
    this.mediaChange.emit(null);
  }
}
