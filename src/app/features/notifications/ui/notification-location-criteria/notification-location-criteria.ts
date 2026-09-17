import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { AudienceEstimate } from '../../models/audience-estimate';
import { NotificationGovernorate } from '../../models/notification-form-options';
import { buildAudienceEstimateLabels } from '../../state/audience-estimate-labels';

/** The grey "معايير التخصيص الجغرافي والسلوكي" panel under "مخصص حسب الموقع". */
@Component({
  selector: 'app-notification-location-criteria',
  imports: [AppIcon],
  templateUrl: './notification-location-criteria.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationLocationCriteria {
  readonly governorates = input.required<readonly NotificationGovernorate[]>();
  readonly governorateId = input.required<string | null>();
  readonly areaId = input.required<string | null>();
  readonly estimate = input<AudienceEstimate | null>(null);
  readonly error = input<string | null>(null);
  readonly governorateIdChange = output<string | null>();
  readonly areaIdChange = output<string | null>();

  protected readonly areas = computed(
    () =>
      this.governorates().find((governorate) => governorate.id === this.governorateId())?.areas ??
      [],
  );
  protected readonly estimateLabels = computed(() => {
    const estimate = this.estimate();
    return estimate ? buildAudienceEstimateLabels(estimate) : null;
  });

  protected pickGovernorate(event: Event): void {
    this.governorateIdChange.emit(readSelected(event));
    this.areaIdChange.emit(null);
  }

  protected pickArea(event: Event): void {
    this.areaIdChange.emit(readSelected(event));
  }
}

function readSelected(event: Event): string | null {
  return (event.target as HTMLSelectElement).value || null;
}
