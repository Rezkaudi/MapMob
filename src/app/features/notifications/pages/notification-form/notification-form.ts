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
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CLOCK } from '../../../../core/config/clock';
import { PICTURE_RULES } from '../../../../shared/files/picture-rules';
import { formatCharacterCount } from '../../../../shared/formatting/character-count';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { FormActionBar } from '../../../../shared/ui/form-action-bar/form-action-bar';
import { FormCard } from '../../../../shared/ui/form-card/form-card';
import { FORM_CONTROL_CLASSES } from '../../../../shared/ui/form-field/form-control-classes';
import { FormField } from '../../../../shared/ui/form-field/form-field';
import { FormPageHeading } from '../../../../shared/ui/form-page-heading/form-page-heading';
import { ImageUploadField } from '../../../../shared/ui/image-upload-field/image-upload-field';
import { UploadedImage } from '../../../../shared/ui/image-upload-field/uploaded-image';
import { toUploadedImage } from '../../../../shared/ui/image-upload-field/uploaded-image-from-url';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { Toast } from '../../../../shared/ui/toast/toast';
import { NotificationAudience } from '../../models/notification-audience';
import { NotificationDetail } from '../../models/notification-detail';
import { NotificationSaveIntent } from '../../models/notification-draft';
import { RecipientMode } from '../../models/recipient-mode';
import { SendTiming } from '../../models/send-timing';
import { toAudienceEstimateQuery } from '../../state/audience-estimate-query';
import { toNotificationDraft } from '../../state/notification-draft-mapping';
import {
  buildNotificationFormErrors,
  NotificationFormErrors,
} from '../../state/notification-form-errors';
import {
  NOTIFICATION_BODY_MAX_LENGTH,
  NOTIFICATION_TITLE_MAX_LENGTH,
  buildNotificationFormGroup,
  toNotificationFormValue,
} from '../../state/notification-form-group';
import { NotificationFormStore } from '../../state/notification-form.store';
import { toWallClockTime } from '../../state/wall-clock-time';
import { NotificationAudiencePicker } from '../../ui/notification-audience-picker/notification-audience-picker';
import { NotificationLocationCriteria } from '../../ui/notification-location-criteria/notification-location-criteria';
import { NotificationRecipientPicker } from '../../ui/notification-recipient-picker/notification-recipient-picker';
import { NotificationSendTiming } from '../../ui/notification-send-timing/notification-send-timing';
import { NOTIFICATION_FORM_COPY } from './notification-form-copy';

const NOTIFICATIONS_URL = '/notifications';

@Component({
  selector: 'app-notification-form',
  imports: [
    ErrorState,
    FormActionBar,
    FormCard,
    FormField,
    FormPageHeading,
    ImageUploadField,
    NotificationAudiencePicker,
    NotificationLocationCriteria,
    NotificationRecipientPicker,
    NotificationSendTiming,
    ReactiveFormsModule,
    Skeleton,
    Toast,
  ],
  templateUrl: './notification-form.html',
  providers: [NotificationFormStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationForm {
  /** Set on the edit route; the create route leaves it undefined. */
  readonly id = input<string | undefined>();

  private readonly router = inject(Router);
  private readonly clock = inject(CLOCK);

  protected readonly store = inject(NotificationFormStore);
  protected readonly form = buildNotificationFormGroup(() => toWallClockTime(this.clock()));
  protected readonly controlClasses = FORM_CONTROL_CLASSES;
  protected readonly pictureRules = PICTURE_RULES;
  protected readonly notificationsUrl = NOTIFICATIONS_URL;
  protected readonly titleMaxLength = NOTIFICATION_TITLE_MAX_LENGTH;
  protected readonly bodyMaxLength = NOTIFICATION_BODY_MAX_LENGTH;
  protected readonly copy = computed(() => NOTIFICATION_FORM_COPY[this.id() ? 'edit' : 'create']);
  private readonly formChanges = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });
  /** View state only: the picture picked or kept, and what the recipient search box holds. */
  protected readonly image = signal<UploadedImage | null>(null);
  protected readonly recipientSearch = signal('');

  constructor() {
    this.store.load(computed(() => this.id() ?? null));
    this.store.estimateAudience(computed(() => toAudienceEstimateQuery(this.trackedValue())));
    this.store.searchRecipients(
      computed(() => ({ audience: this.trackedValue().audience, search: this.recipientSearch() })),
    );
    effect(() => {
      const detail = this.store.editedDetail();
      if (detail) {
        untracked(() => this.fillFrom(detail));
      }
    });
  }

  protected get errors(): NotificationFormErrors {
    return buildNotificationFormErrors(this.form);
  }

  protected get titleCounter(): string {
    return formatCharacterCount(this.form.controls.title.value, NOTIFICATION_TITLE_MAX_LENGTH);
  }

  protected get bodyCounter(): string {
    return formatCharacterCount(this.form.controls.body.value, NOTIFICATION_BODY_MAX_LENGTH);
  }

  protected changeAudience(audience: NotificationAudience): void {
    this.form.patchValue({ audience, recipientIds: [] });
  }

  protected changeRecipientMode(recipientMode: RecipientMode): void {
    this.form.controls.recipientMode.setValue(recipientMode);
  }

  protected changeGovernorate(governorateId: string | null): void {
    this.form.controls.governorateId.setValue(governorateId);
    this.form.controls.governorateId.markAsTouched();
  }

  protected changeRecipients(recipientIds: readonly string[]): void {
    this.form.controls.recipientIds.setValue(recipientIds);
    this.form.controls.recipientIds.markAsTouched();
  }

  protected changeTiming(timing: SendTiming): void {
    this.form.controls.timing.setValue(timing);
  }

  protected changeSendDay(sendDay: string | null): void {
    this.form.controls.sendDay.setValue(sendDay);
    this.form.controls.sendDay.markAsTouched();
  }

  protected changeSendTime(sendTime: string | null): void {
    this.form.controls.sendTime.setValue(sendTime);
    this.form.controls.sendTime.markAsTouched();
  }

  protected publish(): void {
    this.save('publish');
  }

  protected saveDraft(): void {
    this.save('draft');
  }

  /** The full form value, read through the change signal so computeds rerun on every edit. */
  private trackedValue() {
    this.formChanges();
    return this.form.getRawValue();
  }

  private async save(intent: NotificationSaveIntent): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const draft = toNotificationDraft(this.form.getRawValue(), {
      image: this.image(),
      hadSavedImage: Boolean(this.store.editedDetail()?.imageUrl),
      intent,
    });
    if (await this.store.save(this.id() ?? null, draft)) {
      this.router.navigateByUrl(NOTIFICATIONS_URL);
    }
  }

  private fillFrom(detail: NotificationDetail): void {
    this.form.reset(toNotificationFormValue(detail));
    this.image.set(toUploadedImage(detail.imageUrl));
  }
}
