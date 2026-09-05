import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { Badge, BadgeTone } from '../../../../shared/ui/badge/badge';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { InfoCard } from '../../../../shared/ui/info-card/info-card';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { PLACE_PACKAGE_LABEL } from '../../models/place-package';
import { PLACE_STATUS_LABEL, PlaceStatus } from '../../models/place-status';
import { PlaceDetailStore } from '../../state/place-detail.store';
import { PlaceDetailSkeleton } from './place-detail-skeleton/place-detail-skeleton';
import { PlaceGallery } from './place-gallery/place-gallery';
import { PlaceContactCard } from './place-contact-card/place-contact-card';
import { PlaceHoursCard } from './place-hours-card/place-hours-card';
import { PlaceLocationCard } from './place-location-card/place-location-card';

const STATUS_TEXT_CLASS: Record<PlaceStatus, string> = {
  active: 'text-success',
  suspended: 'text-error',
  pending: 'text-warning',
};

const STATUS_TONE: Record<PlaceStatus, BadgeTone> = {
  active: 'success',
  suspended: 'error',
  pending: 'warning',
};

@Component({
  selector: 'app-place-detail',
  imports: [
    AppIcon,
    Badge,
    ErrorState,
    InfoCard,
    PlaceDetailSkeleton,
    PlaceGallery,
    PlaceContactCard,
    PlaceHoursCard,
    PlaceLocationCard,
    ArabicDatePipe,
    RouterLink,
  ],
  templateUrl: './place-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceDetail {
  /** Bound from the route parameter by `withComponentInputBinding`. */
  readonly id = input.required<string>();

  protected readonly store = inject(PlaceDetailStore);
  protected readonly statusLabel = PLACE_STATUS_LABEL;
  protected readonly statusTone = STATUS_TONE;
  protected readonly statusTextClass = STATUS_TEXT_CLASS;
  protected readonly packageLabel = PLACE_PACKAGE_LABEL;

  protected readonly place = this.store.place;
  protected readonly isSuspended = computed(() => this.place()?.status === 'suspended');

  constructor() {
    this.store.loadPlace(this.id);
  }

  protected reload(): void {
    this.store.loadPlace(this.id());
  }
}
