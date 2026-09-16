import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { FormActionBar } from '../../../../shared/ui/form-action-bar/form-action-bar';
import { FormPageHeading } from '../../../../shared/ui/form-page-heading/form-page-heading';
import { UploadedImage } from '../../../../shared/ui/image-upload-field/uploaded-image';
import { toUploadedImage } from '../../../../shared/ui/image-upload-field/uploaded-image-from-url';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { Toast } from '../../../../shared/ui/toast/toast';
import { AdDetail } from '../../models/ad-detail';
import { AdSavedStatus } from '../../models/ad-draft';
import { toAdDraft, toAdFormValue } from '../../state/ad-draft-mapping';
import { AdFormErrors, buildAdFormErrors } from '../../state/ad-form-errors';
import { createAdFormGroup } from '../../state/ad-form-group';
import { AdFormStore } from '../../state/ad-form.store';
import { AdBasicInfoCard } from '../../ui/ad-basic-info-card/ad-basic-info-card';
import { AdMediaCard } from '../../ui/ad-media-card/ad-media-card';
import { AdPlacementCard } from '../../ui/ad-placement-card/ad-placement-card';
import { AdScheduleCard } from '../../ui/ad-schedule-card/ad-schedule-card';
import { AD_FORM_COPY } from './ad-form-copy';

const ADS_URL = '/ads';

@Component({
  selector: 'app-ad-form',
  imports: [
    AdBasicInfoCard,
    AdMediaCard,
    AdPlacementCard,
    AdScheduleCard,
    ErrorState,
    FormActionBar,
    FormPageHeading,
    ReactiveFormsModule,
    Skeleton,
    Toast,
  ],
  templateUrl: './ad-form.html',
  providers: [AdFormStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdForm {
  /** Set on the edit route; the add route leaves it undefined. */
  readonly id = input<string | undefined>();

  private readonly router = inject(Router);

  protected readonly store = inject(AdFormStore);
  protected readonly form = createAdFormGroup(inject(FormBuilder));
  protected readonly adsUrl = ADS_URL;
  /** View state only: the picture or video picked or kept in the form. */
  protected readonly media = signal<UploadedImage | null>(null);
  protected readonly copy = computed(() => AD_FORM_COPY[this.id() ? 'edit' : 'add']);

  constructor() {
    this.store.load(computed(() => this.id() ?? null));
    effect(() => {
      const detail = this.store.editedDetail();
      if (detail) {
        untracked(() => this.fillFrom(detail));
      }
    });
  }

  protected get errors(): AdFormErrors {
    return buildAdFormErrors(this.form);
  }

  protected publish(): void {
    this.save(this.form.controls.status.value);
  }

  protected saveDraft(): void {
    this.save('draft');
  }

  private async save(status: AdSavedStatus): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const draft = toAdDraft(this.form.getRawValue(), {
      media: this.media(),
      hadSavedMedia: Boolean(this.store.editedDetail()?.mediaUrl),
      status,
    });
    if (await this.store.save(this.id() ?? null, draft)) {
      this.router.navigateByUrl(ADS_URL);
    }
  }

  private fillFrom(detail: AdDetail): void {
    const value = toAdFormValue(detail);
    this.form.reset(value);
    if (value.isOngoing) {
      this.form.controls.endsOn.disable();
    }
    this.media.set(toUploadedImage(detail.mediaUrl));
  }
}
