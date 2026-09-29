import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { NamedReference } from '../../../../shared/models/named-reference';
import { StoreCard } from '../store-card/store-card';

const NO_SUB_CATEGORY = '—';

/** Categories are an admin's to set; the owner sees them locked with a way to ask for a change. */
@Component({
  selector: 'app-store-classification-card',
  imports: [AppIcon, StoreCard],
  templateUrl: './store-classification-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreClassificationCard {
  readonly mainCategory = input.required<NamedReference>();
  readonly subCategory = input.required<NamedReference | null>();
  readonly supportUrl = input.required<string>();

  /** RTL: the main category comes first, so it sits on the right. */
  protected readonly categories = computed(() => [
    { label: 'التصنيف الرئيسي', value: this.mainCategory().name },
    { label: 'التصنيف الفرعي', value: this.subCategory()?.name ?? NO_SUB_CATEGORY },
  ]);
}
