import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { SelectOption } from '../../../../shared/ui/select-field/select-option';
import { RegionDraft } from '../../models/region-draft';
import { REGION_STATUS_OPTION_LABEL, RegionStatus } from '../../models/region-status';
import { RegionFormCopy } from '../region-form-copy';

const STATUS_OPTIONS: readonly SelectOption[] = (
  Object.keys(REGION_STATUS_OPTION_LABEL) as RegionStatus[]
).map((status) => ({ value: status, label: REGION_STATUS_OPTION_LABEL[status] }));

@Component({
  selector: 'app-region-form-dialog',
  imports: [AppIcon],
  templateUrl: './region-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionFormDialog {
  readonly copy = input.required<RegionFormCopy>();
  readonly initialName = input<string>('');
  readonly initialStatus = input<RegionStatus>('active');
  /** Set when adding or editing an area: its governorate is shown but cannot change. */
  readonly lockedGovernorateName = input<string>('');
  readonly isBusy = input<boolean>(false);
  readonly submitted = output<RegionDraft>();
  readonly cancelled = output<void>();

  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly name = linkedSignal(() => this.initialName());
  protected readonly status = linkedSignal(() => this.initialStatus());
  protected readonly trimmedName = computed(() => this.name().trim());
  protected readonly canSubmit = computed(() => this.trimmedName().length > 0 && !this.isBusy());

  protected onNameInput(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  protected onStatusChange(event: Event): void {
    this.status.set((event.target as HTMLSelectElement).value as RegionStatus);
  }

  protected submit(event: Event): void {
    event.preventDefault();
    if (!this.canSubmit()) {
      return;
    }
    this.submitted.emit({ name: this.trimmedName(), status: this.status() });
  }

  @HostListener('document:keydown.escape')
  protected cancelOnEscape(): void {
    this.cancelled.emit();
  }
}
