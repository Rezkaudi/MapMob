import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { OptionCard } from '../../../../shared/ui/option-card/option-card';
import { OfferItem } from '../../models/offer-item';
import { OfferScope } from '../../models/offer-scope';
import { OfferItemPicker } from '../offer-item-picker/offer-item-picker';

interface ScopeChoice {
  readonly scope: OfferScope;
  readonly title: string;
  readonly description: string;
}

/** RTL puts the first card on the right, as the design does. */
const SCOPE_CHOICES: readonly ScopeChoice[] = [
  {
    scope: 'allItems',
    title: 'جميع المنتجات والخدمات',
    description: 'يشمل هذا العرض كامل قائمة المنتجات والخدمات المتاحة لدى المتجر دون استثناء.',
  },
  {
    scope: 'selectedItems',
    title: 'منتجات وخدمات محددة',
    description: 'حدد يدوياً المنتجات أو الخدمات الخاصة التي ترغب في تفعيل العرض عليها.',
  },
];

@Component({
  selector: 'app-offer-scope-picker',
  imports: [OfferItemPicker, OptionCard],
  templateUrl: './offer-scope-picker.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferScopePicker {
  readonly scope = input.required<OfferScope>();
  readonly items = input.required<readonly OfferItem[]>();
  readonly selectedItemIds = input.required<readonly string[]>();
  readonly isItemsLoading = input<boolean>(false);
  readonly itemsError = input<string | null>(null);
  readonly scopeChange = output<OfferScope>();
  readonly selectedItemIdsChange = output<readonly string[]>();

  protected readonly choices = SCOPE_CHOICES;
}
