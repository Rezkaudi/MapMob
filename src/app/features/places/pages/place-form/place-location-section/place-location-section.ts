import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { FieldLabel } from '../../../../../shared/ui/field-label/field-label';
import { FormSection } from '../../../../../shared/ui/form-section/form-section';
import { MapPicker } from '../../../../../shared/ui/map-picker/map-picker';
import { MapPoint } from '../../../../../shared/ui/map-picker/map-point';
import { PlaceFormGroup } from '../../../state/place-form-group';
import { PlaceFieldControl } from '../../../ui/place-field-control';
import { PlaceSelectFrame } from '../../../ui/place-select-frame/place-select-frame';

const NO_GEOLOCATION_MESSAGE = 'المتصفح لا يدعم تحديد الموقع';
const LOCATION_FAILED_MESSAGE = 'تعذر تحديد موقعك، اختر الموقع من الخريطة';

@Component({
  selector: 'app-place-location-section',
  imports: [
    AppIcon,
    FieldLabel,
    FormSection,
    MapPicker,
    PlaceFieldControl,
    PlaceSelectFrame,
    ReactiveFormsModule,
  ],
  templateUrl: './place-location-section.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceLocationSection {
  readonly form = input.required<PlaceFormGroup>();
  readonly cities = input.required<readonly string[]>();
  readonly regions = input.required<readonly string[]>();

  protected readonly isPickingOnMap = signal(false);
  protected readonly locationError = signal('');

  protected startPickingOnMap(): void {
    this.locationError.set('');
    this.isPickingOnMap.set(true);
  }

  protected setPoint(point: MapPoint): void {
    this.form().patchValue({ latitude: point.latitude, longitude: point.longitude });
  }

  protected useMyLocation(): void {
    if (!navigator.geolocation) {
      this.locationError.set(NO_GEOLOCATION_MESSAGE);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setPoint({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        this.startPickingOnMap();
      },
      () => this.locationError.set(LOCATION_FAILED_MESSAGE),
    );
  }
}
