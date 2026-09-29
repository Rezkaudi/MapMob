import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormMode } from '../../../../shared/models/form-mode';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { FieldLabel } from '../../../../shared/ui/field-label/field-label';
import { FormDialogFrame } from '../../../../shared/ui/form-dialog-frame/form-dialog-frame';
import { DeliveryPlatformDraft } from '../../models/delivery-platform-draft';
import { DELIVERY_PLATFORM_STATUS_LABEL } from '../../models/delivery-platform-status';
import { findDeliveryPlatformFieldErrors } from '../../state/delivery-platform-field-errors';
import {
  createDeliveryPlatformFormGroup,
  readDeliveryPlatformFields,
} from '../../state/delivery-platform-form-group';
import { DELIVERY_PLATFORM_FORM_COPY } from '../delivery-platform-dialog-copy';
import { PlatformLogoField } from '../platform-logo-field/platform-logo-field';

const STATUS_CHOICES = (
  Object.keys(DELIVERY_PLATFORM_STATUS_LABEL) as (keyof typeof DELIVERY_PLATFORM_STATUS_LABEL)[]
).map((value) => ({ value, label: DELIVERY_PLATFORM_STATUS_LABEL[value] }));

@Component({
  selector: 'app-delivery-platform-form-dialog',
  imports: [AppIcon, FieldLabel, FormDialogFrame, PlatformLogoField, ReactiveFormsModule],
  templateUrl: './delivery-platform-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryPlatformFormDialog {
  readonly mode = input.required<FormMode>();
  /** `null` opens an empty add dialog. */
  readonly initialDraft = input.required<DeliveryPlatformDraft | null>();
  /** Shown as the position placeholder and used when that box is left empty. */
  readonly suggestedSortOrder = input.required<number>();
  readonly isBusy = input<boolean>(false);
  readonly submitted = output<DeliveryPlatformDraft>();
  readonly cancelled = output<void>();

  protected readonly statusChoices = STATUS_CHOICES;
  protected readonly copy = computed(() => DELIVERY_PLATFORM_FORM_COPY[this.mode()]);
  protected readonly form = computed(() => createDeliveryPlatformFormGroup(this.initialDraft()));
  protected readonly logoUrl = linkedSignal(() => this.initialDraft()?.logoUrl ?? null);
  private readonly logoFile = signal<File | null>(null);
  /** Goes up on every change of the form, so the OnPush messages follow it. */
  private readonly formVersion = signal(0);
  protected readonly errors = computed(() => {
    this.formVersion();
    return findDeliveryPlatformFieldErrors(this.form());
  });

  constructor() {
    effect((onCleanup) => {
      const subscription = this.form().events.subscribe(() =>
        this.formVersion.update((version) => version + 1),
      );
      onCleanup(() => subscription.unsubscribe());
    });
  }

  protected onLogoPicked(file: File): void {
    this.logoFile.set(file);
  }

  protected onLogoRemoved(): void {
    this.logoFile.set(null);
    this.logoUrl.set(null);
  }

  protected submit(): void {
    const form = this.form();
    form.markAllAsTouched();
    if (form.invalid || this.isBusy()) {
      return;
    }
    this.submitted.emit({
      ...readDeliveryPlatformFields(form, this.suggestedSortOrder()),
      logoFile: this.logoFile(),
      logoUrl: this.logoUrl(),
    });
  }
}
