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
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  toOfferDraftFields,
  toOfferFieldsValue,
} from '../../../../shared/forms/offer-draft-mapping';
import { OFFER_FORM_COPY } from '../../../../shared/forms/offer-form-copy';
import { createOfferFieldsFormGroup } from '../../../../shared/forms/offer-form-controls';
import { OfferSavedStatus } from '../../../../shared/models/offer-saved-status';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { FormActionBar } from '../../../../shared/ui/form-action-bar/form-action-bar';
import { FormPageHeading } from '../../../../shared/ui/form-page-heading/form-page-heading';
import { FormSection } from '../../../../shared/ui/form-section/form-section';
import { UploadedImage } from '../../../../shared/ui/image-upload-field/uploaded-image';
import { toUploadedImage } from '../../../../shared/ui/image-upload-field/uploaded-image-from-url';
import { OfferFormFields } from '../../../../shared/ui/offer-form-fields/offer-form-fields';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { Toast } from '../../../../shared/ui/toast/toast';
import { MERCHANT_OFFERS_URL } from '../../merchant-offer-links';
import { MerchantOffer } from '../../models/merchant-offer';
import { MerchantOfferFormStore } from '../../state/merchant-offer-form.store';

@Component({
  selector: 'app-merchant-offer-form-page',
  imports: [
    ErrorState,
    FormActionBar,
    FormPageHeading,
    FormSection,
    OfferFormFields,
    ReactiveFormsModule,
    Skeleton,
    Toast,
  ],
  templateUrl: './merchant-offer-form-page.html',
  providers: [MerchantOfferFormStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantOfferFormPage {
  /** Set on the edit route; the add route leaves it undefined. */
  readonly id = input<string | undefined>();

  private readonly router = inject(Router);

  protected readonly store = inject(MerchantOfferFormStore);
  protected readonly form = createOfferFieldsFormGroup();
  protected readonly offersUrl = MERCHANT_OFFERS_URL;
  /** View state only: the picture picked or kept in the form. */
  protected readonly image = signal<UploadedImage | null>(null);
  protected readonly copy = computed(() => OFFER_FORM_COPY[this.id() ? 'edit' : 'add']);

  constructor() {
    this.store.load(computed(() => this.id() ?? null));
    effect(() => {
      const offer = this.store.editedOffer();
      if (offer) {
        untracked(() => this.fillFrom(offer));
      }
    });
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
    const draft = toOfferDraftFields(this.form.getRawValue(), {
      image: this.image(),
      hadSavedImage: Boolean(this.store.editedOffer()?.imageUrl),
      status,
    });
    if (await this.store.save(draft)) {
      this.router.navigateByUrl(MERCHANT_OFFERS_URL);
    }
  }

  private fillFrom(offer: MerchantOffer): void {
    this.form.reset(toOfferFieldsValue(offer));
    this.image.set(toUploadedImage(offer.imageUrl));
  }
}
