import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { isDateRangeValid } from '../../../../shared/formatting/date-range-summary';
import { CampaignStatus } from '../../../../shared/models/campaign-status';
import { CAMPAIGN_STATUS_CHOICES } from '../../../../shared/models/campaign-status-choices';
import { DateRange } from '../../../../shared/models/date-range';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ChoiceChips } from '../../../../shared/ui/choice-chips/choice-chips';
import { DateRangeFields } from '../../../../shared/ui/date-range-fields/date-range-fields';
import { FilterPopover } from '../../../../shared/ui/filter-popover/filter-popover';
import { AdAdvertiserType } from '../../models/ad-advertiser-type';
import { AdContentType } from '../../models/ad-content-type';
import { AdFilters, NO_AD_FILTERS } from '../../models/ad-filters';
import { AdPlacement } from '../../models/ad-placement';
import {
  AD_ADVERTISER_TYPE_CHOICES,
  AD_CONTENT_TYPE_CHOICES,
  AD_PLACEMENT_OPTIONS,
} from './ad-filter-choices';

/** The popover under "الفلاتر". Picks stay a draft until "تطبيق الفلاتر". */
@Component({
  selector: 'app-ad-filter-panel',
  imports: [AppIcon, ChoiceChips, DateRangeFields, FilterPopover],
  templateUrl: './ad-filter-panel.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdFilterPanel {
  readonly filters = input.required<AdFilters>();
  readonly applied = output<AdFilters>();
  readonly closed = output<void>();

  protected readonly statusOptions = CAMPAIGN_STATUS_CHOICES;
  protected readonly contentTypeOptions = AD_CONTENT_TYPE_CHOICES;
  protected readonly advertiserTypeOptions = AD_ADVERTISER_TYPE_CHOICES;
  protected readonly placementOptions = AD_PLACEMENT_OPTIONS;
  protected readonly draft = linkedSignal(() => this.filters());
  protected readonly canApply = computed(() => {
    const { from, to } = this.draft().runningRange;
    return !from || !to || isDateRangeValid({ from, to });
  });

  protected pickStatus(status: string | null): void {
    this.patchDraft({ status: status as CampaignStatus | null });
  }

  /** These groups have no "الكل" chip, so clicking the picked chip again clears it. */
  protected toggleContentType(contentType: string | null): void {
    const picked = this.draft().contentType === contentType ? null : contentType;
    this.patchDraft({ contentType: picked as AdContentType | null });
  }

  protected toggleAdvertiserType(advertiserType: string | null): void {
    const picked = this.draft().advertiserType === advertiserType ? null : advertiserType;
    this.patchDraft({ advertiserType: picked as AdAdvertiserType | null });
  }

  protected pickPlacement(event: Event): void {
    const placement = (event.target as HTMLSelectElement).value;
    this.patchDraft({ placement: (placement || null) as AdPlacement | null });
  }

  protected changeRange(runningRange: DateRange): void {
    this.patchDraft({ runningRange });
  }

  protected apply(): void {
    if (this.canApply()) {
      this.applied.emit(this.draft());
    }
  }

  protected reset(): void {
    this.draft.set(NO_AD_FILTERS);
    this.applied.emit(NO_AD_FILTERS);
  }

  private patchDraft(patch: Partial<AdFilters>): void {
    this.draft.update((draft) => ({ ...draft, ...patch }));
  }
}
