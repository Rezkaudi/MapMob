import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { FieldLabel } from '../../../../shared/ui/field-label/field-label';
import { FileRules } from '../../../../shared/ui/media-picker/file-rules';
import { MediaFile } from '../../../../shared/ui/media-picker/media-file';
import { MediaPicker } from '../../../../shared/ui/media-picker/media-picker';
import { FormSection } from '../../../../shared/ui/form-section/form-section';
import { MapPicker } from '../../../../shared/ui/map-picker/map-picker';
import { MapPoint } from '../../../../shared/ui/map-picker/map-point';
import { PLACE_PACKAGE_LABEL, PlacePackage } from '../../models/place-package';
import { PLACE_STATUS_LABEL, PlaceStatus } from '../../models/place-status';
import { WorkingDay, createDefaultWeek } from '../../models/working-day';
import { ServicesEditor } from './services-editor/services-editor';
import { WorkingHoursEditor } from './working-hours-editor/working-hours-editor';

const CATEGORIES = ['صيدلية', 'مطعم', 'مقهى', 'سوبر ماركت', 'عيادة'];
const CITIES = ['الرياض', 'جدة', 'الدمام', 'طرطوس'];
const DEFAULT_SERVICES = ['توصيل', 'خدمة 24 ساعة', 'مواقف سيارات'];
const MEGABYTE = 1024 * 1024;

const IMAGE_RULES: FileRules = {
  maxBytes: 5 * MEGABYTE,
  accepted: ['image/jpeg', 'image/png'],
  typeMessage: 'يُسمح بصيغ JPG و PNG فقط',
  sizeMessage: 'الحد الأقصى لحجم الصورة 5 ميجابايت',
};

const VIDEO_RULES: FileRules = {
  maxBytes: 50 * MEGABYTE,
  accepted: ['video/*'],
  typeMessage: 'يُسمح بملفات الفيديو فقط',
  sizeMessage: 'الحد الأقصى لحجم الفيديو 50 ميجابايت',
};

/** Tartus, the city the design centres its map on. */
const DEFAULT_LATITUDE = 34.8959;
const DEFAULT_LONGITUDE = 35.8866;

const ALL_DAY_OPENS_AT = '00:00';
const ALL_DAY_CLOSES_AT = '23:59';

@Component({
  selector: 'app-place-form',
  imports: [
    AppIcon,
    FieldLabel,
    MapPicker,
    MediaPicker,
    FormSection,
    ServicesEditor,
    WorkingHoursEditor,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './place-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceForm {
  /** Set on the edit route; the add route leaves it undefined. */
  readonly id = input<string | undefined>('');

  private readonly formBuilder = inject(FormBuilder);

  protected readonly categories = CATEGORIES;
  protected readonly cities = CITIES;
  protected readonly packages = (Object.keys(PLACE_PACKAGE_LABEL) as PlacePackage[]).map(
    (value) => ({ value, label: PLACE_PACKAGE_LABEL[value] }),
  );
  protected readonly statuses = (Object.keys(PLACE_STATUS_LABEL) as PlaceStatus[]).map((value) => ({
    value,
    label: PLACE_STATUS_LABEL[value],
  }));

  protected readonly isEditing = computed(() => Boolean(this.id()));
  protected readonly heading = computed(() =>
    this.isEditing() ? 'تعديل المكان' : 'إضافة مكان جديد',
  );

  protected readonly week = signal<readonly WorkingDay[]>(createDefaultWeek());
  protected readonly services = signal<readonly string[]>(DEFAULT_SERVICES);
  protected readonly imageRules = IMAGE_RULES;
  protected readonly videoRules = VIDEO_RULES;
  protected readonly isPickingOnMap = signal(false);
  protected readonly locationError = signal('');
  protected readonly images = signal<readonly MediaFile[]>([]);
  protected readonly videos = signal<readonly MediaFile[]>([]);

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    ownerName: [''],
    ownerPhone: ['', Validators.required],
    ownerExtraPhone: [''],
    mainCategory: ['', Validators.required],
    subCategory: [''],
    city: ['', Validators.required],
    region: ['', Validators.required],
    address: ['', Validators.required],
    latitude: [DEFAULT_LATITUDE],
    longitude: [DEFAULT_LONGITUDE],
    phone: ['', Validators.required],
    extraPhone: [''],
    website: [''],
    whatsapp: [''],
    useMainPhoneForWhatsapp: [false],
    facebook: [''],
    instagram: [''],
    telegram: [''],
    description: [''],
    package: ['free', Validators.required],
    status: ['pending', Validators.required],
  });

  protected startPickingOnMap(): void {
    this.locationError.set('');
    this.isPickingOnMap.set(true);
  }

  protected setPoint(point: MapPoint): void {
    this.form.patchValue({ latitude: point.latitude, longitude: point.longitude });
  }

  protected useMyLocation(): void {
    if (!navigator.geolocation) {
      this.locationError.set('المتصفح لا يدعم تحديد الموقع');
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
      () => this.locationError.set('تعذر تحديد موقعك، اختر الموقع من الخريطة'),
    );
  }

  protected openAllDay(): void {
    this.week.update((week) =>
      week.map((day) => ({
        ...day,
        isOpen: true,
        opensAt: ALL_DAY_OPENS_AT,
        closesAt: ALL_DAY_CLOSES_AT,
      })),
    );
  }

  /** The write endpoint is not built yet, so saving only validates for now. */
  protected save(): void {
    this.form.markAllAsTouched();
  }
}
