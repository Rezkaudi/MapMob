import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PICTURE_RULES } from '../../../../shared/files/picture-rules';
import { VIDEO_RULES } from '../../../../shared/files/video-rules';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { FieldLabel } from '../../../../shared/ui/field-label/field-label';
import { MediaFile } from '../../../../shared/ui/media-picker/media-file';
import { MediaPicker } from '../../../../shared/ui/media-picker/media-picker';
import { FormSection } from '../../../../shared/ui/form-section/form-section';
import { MapPicker } from '../../../../shared/ui/map-picker/map-picker';
import { MapPoint } from '../../../../shared/ui/map-picker/map-point';
import { Toast } from '../../../../shared/ui/toast/toast';
import { PLACE_PACKAGE_LABEL, PlacePackage } from '../../models/place-package';
import { PLACE_STATUS_LABEL, PlaceStatus } from '../../models/place-status';
import { PACKAGE_PRODUCT_LIMIT } from '../../models/package-product-limit';
import { PlaceProduct } from '../../models/place-product';
import { ProductDraft } from '../../models/product-draft';
import { WorkingDay, createDefaultWeek } from '../../models/working-day';
import { ProductDialog } from '../../ui/product-dialog/product-dialog';
import { ProductsEditor } from './products-editor/products-editor';
import { ServicesEditor } from './services-editor/services-editor';
import { WorkingHoursEditor } from './working-hours-editor/working-hours-editor';

const CATEGORIES = ['صيدلية', 'مطعم', 'مقهى', 'سوبر ماركت', 'عيادة'];
const CITIES = ['الرياض', 'جدة', 'الدمام', 'طرطوس'];
const DEFAULT_SERVICES = ['توصيل', 'خدمة 24 ساعة', 'مواقف سيارات'];
/** Syrian pound, the only currency the design offers. */
const CURRENCY = 'ل.س';

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
    ProductDialog,
    ProductsEditor,
    ServicesEditor,
    Toast,
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

  protected readonly hasSaved = signal(false);
  protected readonly isEditing = computed(() => Boolean(this.id()));
  protected readonly heading = computed(() =>
    this.isEditing() ? 'تعديل المكان' : 'إضافة مكان جديد',
  );

  protected readonly week = signal<readonly WorkingDay[]>(createDefaultWeek());
  protected readonly services = signal<readonly string[]>(DEFAULT_SERVICES);
  protected readonly imageRules = PICTURE_RULES;
  protected readonly videoRules = VIDEO_RULES;
  protected readonly isPickingOnMap = signal(false);
  protected readonly locationError = signal('');
  protected readonly images = signal<readonly MediaFile[]>([]);
  protected readonly products = signal<readonly PlaceProduct[]>([]);
  protected readonly isAddingProduct = signal(false);
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

  /** The control's value only reaches a computed through its value stream. */
  private readonly selectedPackage = toSignal(this.form.controls.package.valueChanges, {
    initialValue: this.form.controls.package.value,
  });
  protected readonly currentPackage = computed(() => this.selectedPackage() as PlacePackage);
  protected readonly productLimit = computed(() => PACKAGE_PRODUCT_LIMIT[this.currentPackage()]);
  protected readonly packageLabel = computed(() => PLACE_PACKAGE_LABEL[this.currentPackage()]);

  protected composeProduct(): void {
    this.isAddingProduct.set(true);
  }

  protected closeProductDialog(): void {
    this.isAddingProduct.set(false);
  }

  protected addProduct(draft: ProductDraft): void {
    this.products.update((products) => [
      ...products,
      { ...draft, id: crypto.randomUUID(), currency: CURRENCY, isAvailable: true },
    ]);
    this.closeProductDialog();
  }

  protected removeProduct(product: PlaceProduct): void {
    this.products.update((products) => products.filter((one) => one.id !== product.id));
  }

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

  /** The write endpoint is not built yet, so saving only validates and confirms. */
  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.hasSaved.set(true);
  }

  protected dismissSavedToast(): void {
    this.hasSaved.set(false);
  }
}
