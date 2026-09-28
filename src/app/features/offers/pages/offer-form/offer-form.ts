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
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { FormActionBar } from '../../../../shared/ui/form-action-bar/form-action-bar';
import { FORM_CONTROL_CLASSES } from '../../../../shared/ui/form-field/form-control-classes';
import { FormField } from '../../../../shared/ui/form-field/form-field';
import { FormPageHeading } from '../../../../shared/ui/form-page-heading/form-page-heading';
import { FormSection } from '../../../../shared/ui/form-section/form-section';
import { UploadedImage } from '../../../../shared/ui/image-upload-field/uploaded-image';
import { toUploadedImage } from '../../../../shared/ui/image-upload-field/uploaded-image-from-url';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { Toast } from '../../../../shared/ui/toast/toast';
import { OfferSavedStatus } from '../../../../shared/models/offer-saved-status';
import { toOfferDraft, toOfferFormValue } from '../../state/offer-draft-mapping';
import { OfferFormErrors, buildOfferFormErrors } from '../../state/offer-form-errors';
import { createOfferFormGroup } from '../../state/offer-form-group';
import { OfferFormStore } from '../../state/offer-form.store';
import { OfferFormFields } from '../../../../shared/ui/offer-form-fields/offer-form-fields';
import { OFFER_FORM_COPY } from '../../../../shared/forms/offer-form-copy';

const OFFERS_URL = '/admin/offers';

@Component({
  selector: 'app-offer-form',
  imports: [
    AppIcon,
    ErrorState,
    FormActionBar,
    FormField,
    FormPageHeading,
    FormSection,
    OfferFormFields,
    ReactiveFormsModule,
    Skeleton,
    Toast,
  ],
  templateUrl: './offer-form.html',
  providers: [OfferFormStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferForm {
  /** Set on the edit route; the add route leaves it undefined. */
  readonly id = input<string | undefined>();

  private readonly router = inject(Router);

  protected readonly store = inject(OfferFormStore);
  protected readonly form = createOfferFormGroup(inject(FormBuilder));
  protected readonly controlClasses = FORM_CONTROL_CLASSES;
  protected readonly offersUrl = OFFERS_URL;
  /** View state only: the picture picked or kept in the form. */
  protected readonly image = signal<UploadedImage | null>(null);
  protected readonly copy = computed(() => OFFER_FORM_COPY[this.id() ? 'edit' : 'add']);

  constructor() {
    this.store.load(computed(() => this.id() ?? null));
    effect(() => {
      const detail = this.store.editedDetail();
      if (detail) {
        untracked(() => this.fillFrom(detail));
      }
    });
  }

  protected get errors(): OfferFormErrors {
    return buildOfferFormErrors(this.form);
  }

  protected pickPlace(event: Event): void {
    const placeId = (event.target as HTMLSelectElement).value;
    const place = this.store.options()?.places.find((candidate) => candidate.id === placeId);
    this.form.patchValue({ placeId, categoryName: place?.categoryName ?? '', itemIds: [] });
    this.form.controls.placeId.markAsTouched();
    this.store.loadItems(placeId);
  }

  protected publish(): void {
    this.save(this.form.controls.status.value);
  }

  protected saveDraft(): void {
    this.save('draft');
  }

  private async save(status: OfferSavedStatus): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const draft = toOfferDraft(this.form.getRawValue(), {
      image: this.image(),
      hadSavedImage: Boolean(this.store.editedDetail()?.imageUrl),
      status,
    });
    if (await this.store.save(this.id() ?? null, draft)) {
      this.router.navigateByUrl(OFFERS_URL);
    }
  }

  private fillFrom(detail: Parameters<typeof toOfferFormValue>[0]): void {
    this.form.reset(toOfferFormValue(detail));
    this.image.set(toUploadedImage(detail.imageUrl));
  }
}
