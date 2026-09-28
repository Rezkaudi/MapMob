import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CampaignPauseAction } from '../../../../shared/models/campaign-pause-action';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

const OUTLINED_BUTTON =
  'flex items-center justify-center gap-1 rounded-lg border px-4 text-[12px]/[16px] disabled:cursor-not-allowed disabled:opacity-60';

/** The drawer footer: "تعديل العرض" fills the right, the pause toggle and "حذف" hug their words. */
@Component({
  selector: 'app-merchant-offer-actions',
  imports: [AppIcon],
  templateUrl: './merchant-offer-actions.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantOfferActions {
  readonly pauseAction = input<CampaignPauseAction | null>(null);
  readonly isBusy = input<boolean>(false);
  readonly edit = output<void>();
  readonly pause = output<void>();
  readonly resume = output<void>();
  readonly remove = output<void>();

  protected readonly outlinedButton = OUTLINED_BUTTON;
}
