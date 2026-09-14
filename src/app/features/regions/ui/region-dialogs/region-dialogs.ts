import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RegionDraft } from '../../models/region-draft';
import { RegionKind } from '../../models/region-kind';
import { RegionConfirmDialog } from '../region-confirm-dialog/region-confirm-dialog';
import { buildConfirmCopy, buildFormCopy } from '../region-dialog-copy';
import { RegionDialogRequest } from '../region-dialog-request';
import { RegionFormDialog } from '../region-form-dialog/region-form-dialog';

@Component({
  selector: 'app-region-dialogs',
  imports: [RegionConfirmDialog, RegionFormDialog],
  templateUrl: './region-dialogs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionDialogs {
  readonly kind = input.required<RegionKind>();
  readonly request = input.required<RegionDialogRequest | null>();
  /** Shown locked in the area form; left empty on the governorate page. */
  readonly governorateName = input<string>('');
  readonly isBusy = input<boolean>(false);
  readonly draftSubmitted = output<RegionDraft>();
  readonly confirmed = output<void>();
  readonly closed = output<void>();

  protected readonly form = computed(() => {
    const request = this.request();
    if (request?.type !== 'form') {
      return null;
    }
    return {
      copy: buildFormCopy(this.kind(), request.mode),
      name: request.entry?.name ?? '',
      status: request.entry?.status ?? 'active',
    };
  });

  protected readonly confirmCopy = computed(() => {
    const request = this.request();
    if (request?.type !== 'confirm') {
      return null;
    }
    return buildConfirmCopy(this.kind(), request.action, request.entry.name);
  });

  protected readonly lockedGovernorateName = computed(() =>
    this.kind() === 'area' ? this.governorateName() : '',
  );
}
