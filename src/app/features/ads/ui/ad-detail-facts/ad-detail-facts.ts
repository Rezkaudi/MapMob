import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AdDetailView } from '../../state/ad-detail-view';

interface AdFact {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'app-ad-detail-facts',
  templateUrl: './ad-detail-facts.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdDetailFacts {
  readonly view = input.required<AdDetailView>();

  protected readonly facts = computed<readonly AdFact[]>(() => {
    const view = this.view();
    return [
      { label: 'المعلن', value: view.placeLabel },
      { label: 'نوع المحتوى', value: view.contentTypeLabel },
      { label: 'مكان الظهور', value: view.placementLabel },
      { label: 'موضع الإعلان', value: view.positionLabel },
      { label: 'الأولوية', value: view.priorityLabel },
      { label: 'مدة الإعلان', value: view.periodLabel },
    ];
  });
}
