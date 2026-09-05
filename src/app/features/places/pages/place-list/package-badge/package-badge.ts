import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { PLACE_PACKAGE_LABEL, PlacePackage } from '../../../models/place-package';

const PACKAGE_CLASSES: Record<PlacePackage, string> = {
  free: 'bg-text-muted',
  basic: 'bg-primary',
  premium: 'bg-accent',
};

@Component({
  selector: 'app-package-badge',
  imports: [AppIcon],
  templateUrl: './package-badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageBadge {
  readonly package = input.required<PlacePackage>();

  protected readonly label = computed(() => PLACE_PACKAGE_LABEL[this.package()]);
  protected readonly packageClasses = computed(() => PACKAGE_CLASSES[this.package()]);
}
