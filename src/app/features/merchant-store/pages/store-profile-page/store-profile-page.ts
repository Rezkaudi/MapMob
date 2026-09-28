import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MERCHANT_SUPPORT_URL } from '../../../../core/config/merchant-support-url';
import { formChangeSignal } from '../../../../shared/forms/form-change-signal';
import { formatCharacterCount } from '../../../../shared/formatting/character-count';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { Spinner } from '../../../../shared/ui/spinner/spinner';
import { Toast } from '../../../../shared/ui/toast/toast';
import { WeekDay } from '../../models/week-day';
import { describeStoreLocation } from '../../state/location-summary';
import { findStoreFieldErrors } from '../../state/store-field-errors';
import {
  DESCRIPTION_MAX_LENGTH,
  createStoreProfileFormGroup,
} from '../../state/store-profile-form-group';
import {
  toStoreProfileFormValue,
  toStoreProfileUpdate,
} from '../../state/store-profile-form-mapping';
import { StoreProfileStore } from '../../state/store-profile.store';
import { toWorkingDayRows } from '../../state/working-day-rows';
import { closeDay, openDay, setDayTime } from '../../state/working-week-editing';
import { StoreBasicInfoCard } from '../../ui/store-basic-info-card/store-basic-info-card';
import { StoreClassificationCard } from '../../ui/store-classification-card/store-classification-card';
import { StoreContactCard } from '../../ui/store-contact-card/store-contact-card';
import { StoreHoursCard, WeekDayTimeChange } from '../../ui/store-hours-card/store-hours-card';
import { StoreLocationCard } from '../../ui/store-location-card/store-location-card';

const FIRST_INVALID_FIELD = '[appStoreInput].ng-invalid';

@Component({
  selector: 'app-store-profile-page',
  imports: [
    ErrorState,
    ReactiveFormsModule,
    Skeleton,
    Spinner,
    StoreBasicInfoCard,
    StoreClassificationCard,
    StoreContactCard,
    StoreHoursCard,
    StoreLocationCard,
    Toast,
  ],
  templateUrl: './store-profile-page.html',
  providers: [StoreProfileStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreProfilePage {
  protected readonly store = inject(StoreProfileStore);
  protected readonly supportUrl = inject(MERCHANT_SUPPORT_URL);
  protected readonly form = createStoreProfileFormGroup(inject(FormBuilder));

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly formChanges = formChangeSignal(this.form);
  private readonly pickedCover = signal<File | null>(null);

  protected readonly fieldErrors = computed(() => {
    this.formChanges();
    return findStoreFieldErrors(this.form);
  });
  protected readonly descriptionCounter = computed(() => {
    this.formChanges();
    return formatCharacterCount(this.form.controls.description.value, DESCRIPTION_MAX_LENGTH);
  });
  protected readonly workingDayRows = computed(() => {
    this.formChanges();
    return toWorkingDayRows(this.form.controls.workingHours.value);
  });
  protected readonly isOpen24Hours = computed(() => {
    this.formChanges();
    return this.form.controls.isOpen24Hours.value;
  });
  protected readonly locationSummary = computed(() => {
    this.formChanges();
    const governorate = this.store.profile()?.location.governorate.name ?? '';
    return describeStoreLocation(governorate, this.form.controls.address.value);
  });

  constructor() {
    this.store.load();
    // Every load or save brings the saved place back into the form.
    effect(() => {
      const profile = this.store.profile();
      if (profile) {
        untracked(() => {
          this.form.reset(toStoreProfileFormValue(profile));
          this.pickedCover.set(null);
        });
      }
    });
  }

  protected pickCover(file: File): void {
    this.pickedCover.set(file);
    this.form.markAsDirty();
  }

  protected setOpen24Hours(isOn: boolean): void {
    this.form.controls.isOpen24Hours.setValue(isOn);
    this.form.markAsDirty();
  }

  protected openDay(day: WeekDay): void {
    this.updateWeek(openDay(this.form.controls.workingHours.value, day));
  }

  protected closeDay(day: WeekDay): void {
    this.updateWeek(closeDay(this.form.controls.workingHours.value, day));
  }

  protected changeTime(change: WeekDayTimeChange): void {
    const week = this.form.controls.workingHours.value;
    this.updateWeek(setDayTime(week, change.day, change.field, change.time));
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.host.nativeElement.querySelector<HTMLElement>(FIRST_INVALID_FIELD)?.focus();
      return;
    }
    this.store.save(toStoreProfileUpdate(this.form.getRawValue(), this.pickedCover()));
  }

  private updateWeek(week: Parameters<typeof toWorkingDayRows>[0]): void {
    this.form.controls.workingHours.setValue(week);
    this.form.markAsDirty();
  }
}
