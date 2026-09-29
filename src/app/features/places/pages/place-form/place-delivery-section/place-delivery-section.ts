import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import {
  DeliveryLinkFormGroup,
  findDeliveryLinkError,
  setDeliveryLinkEnabled,
} from '../../../../../shared/forms/delivery-link-form';
import { DeliveryPlatform } from '../../../../../shared/models/delivery-platform';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { FormSection } from '../../../../../shared/ui/form-section/form-section';
import { ToggleSwitch } from '../../../../../shared/ui/toggle-switch/toggle-switch';

const MISSING_LINK_MESSAGE = 'أدخل رابط المتجر على المنصة';

interface PlatformRow {
  readonly platform: DeliveryPlatform;
  readonly link: DeliveryLinkFormGroup;
  readonly isEnabled: boolean;
  readonly inputId: string;
  readonly error: string | null;
}

/** The "منصات التوصيل" card: one switch per ordering app, and its store link once on. */
@Component({
  selector: 'app-place-delivery-section',
  imports: [AppIcon, FormSection, ReactiveFormsModule, ToggleSwitch],
  templateUrl: './place-delivery-section.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceDeliverySection {
  readonly platforms = input.required<readonly DeliveryPlatform[]>();
  readonly links = input.required<FormArray<DeliveryLinkFormGroup>>();

  /** Goes up on every change of the links, so the rows follow the form under OnPush. */
  private readonly linksChangeCount = signal(0);

  protected readonly rows = computed<PlatformRow[]>(() => {
    this.linksChangeCount();
    const links = this.links();
    return this.platforms().map((platform, index) => {
      const link = links.at(index);
      return {
        platform,
        link,
        isEnabled: link.controls.isEnabled.value,
        inputId: `delivery-link-${platform.id}`,
        error: findDeliveryLinkError(link.controls.storeUrl, MISSING_LINK_MESSAGE),
      };
    });
  });

  constructor() {
    effect((onCleanup) => {
      const subscription = this.links().events.subscribe(() =>
        this.linksChangeCount.update((count) => count + 1),
      );
      onCleanup(() => subscription.unsubscribe());
    });
  }

  protected setEnabled(link: DeliveryLinkFormGroup, isEnabled: boolean): void {
    setDeliveryLinkEnabled(link, isEnabled);
  }
}
