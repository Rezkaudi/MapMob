import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Injector,
  afterNextRender,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { resetDeliveryLinks } from '../../../../shared/forms/delivery-link-form';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { FormPageHeading } from '../../../../shared/ui/form-page-heading/form-page-heading';
import { FormSection } from '../../../../shared/ui/form-section/form-section';
import { MediaFile } from '../../../../shared/ui/media-picker/media-file';
import { toSavedMediaFiles } from '../../../../shared/ui/media-picker/saved-media-files';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { Toast } from '../../../../shared/ui/toast/toast';
import { PLACE_PACKAGE_LABEL } from '../../models/place-package';
import { PACKAGE_MEDIA_LIMIT } from '../../models/package-media-limit';
import { PACKAGE_PRODUCT_LIMIT } from '../../models/package-product-limit';
import { PlaceDetail } from '../../models/place-detail';
import { EMPTY_PRODUCT_DRAFT } from '../../../../shared/models/empty-product-draft';
import { PlaceProduct } from '../../models/place-product';
import { ProductDraft } from '../../../../shared/models/product-draft';
import { WorkingDay, createDefaultWeek } from '../../models/working-day';
import { createPlaceFormGroup } from '../../state/place-form-group';
import { fillPlaceForm } from '../../state/place-form-mapping';
import { toSavedVideoFiles } from '../../state/place-video-files';
import { PlaceFormStore } from '../../state/place-form.store';
import { withSavedOption } from '../../state/with-saved-option';
import { toWorkingWeek } from '../../state/working-week-from-rows';
import { ConfirmDialog } from '../../../../shared/ui/confirm-dialog/confirm-dialog';
import { FormMode } from '../../../../shared/models/form-mode';
import { ProductDialog } from '../../../../shared/ui/product-dialog/product-dialog';
import { PlaceBasicInfoSection } from './place-basic-info-section/place-basic-info-section';
import { PlaceDeliverySection } from './place-delivery-section/place-delivery-section';
import { PlaceDetailsSection } from './place-details-section/place-details-section';
import { PlaceFormActions } from './place-form-actions/place-form-actions';
import {
  CATEGORY_OPTIONS,
  CITY_OPTIONS,
  DELIVERY_PLATFORM_OPTIONS,
  REGION_OPTIONS,
} from './place-form-options';
import { PlaceLocationSection } from './place-location-section/place-location-section';
import { PlaceMediaSection } from './place-media-section/place-media-section';
import { PlaceSubscriptionSection } from './place-subscription-section/place-subscription-section';
import { ProductsEditor } from './products-editor/products-editor';
import { WorkingHoursEditor } from './working-hours-editor/working-hours-editor';

/** The delete step the design puts in front of removing a product. */
const REMOVE_PRODUCT_COPY = {
  title: 'حذف المنتج أو الخدمة',
  confirmLabel: 'حذف',
  warning: 'لا يمكن التراجع عن هذا الإجراء.',
};

const ALL_DAY_OPENS_AT = '00:00';
const ALL_DAY_CLOSES_AT = '23:59';

@Component({
  selector: 'app-place-form',
  imports: [
    ConfirmDialog,
    ErrorState,
    FormPageHeading,
    FormSection,
    PlaceBasicInfoSection,
    PlaceDeliverySection,
    PlaceDetailsSection,
    PlaceFormActions,
    PlaceLocationSection,
    PlaceMediaSection,
    PlaceSubscriptionSection,
    ProductDialog,
    ProductsEditor,
    ReactiveFormsModule,
    Skeleton,
    Toast,
    WorkingHoursEditor,
  ],
  templateUrl: './place-form.html',
  providers: [PlaceFormStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceForm {
  /** Set on the edit route; the add route leaves it undefined. */
  readonly id = input<string | undefined>('');

  protected readonly store = inject(PlaceFormStore);
  protected readonly form = createPlaceFormGroup(inject(FormBuilder));

  /** The saved value joins the list when the list does not already offer it. */
  protected readonly categories = computed(() =>
    withSavedOption(CATEGORY_OPTIONS, this.store.editedPlace()?.mainCategory),
  );
  protected readonly cities = computed(() =>
    withSavedOption(CITY_OPTIONS, this.store.editedPlace()?.location.city),
  );
  protected readonly regions = computed(() =>
    withSavedOption(REGION_OPTIONS, this.store.editedPlace()?.location.region),
  );
  /** A saved place lists the apps it came with; a new one is offered every app, switched off. */
  protected readonly deliveryPlatforms = computed(
    () =>
      this.store.editedPlace()?.deliveryLinks.map((link) => link.platform) ??
      DELIVERY_PLATFORM_OPTIONS,
  );

  protected readonly hasSaved = signal(false);
  protected readonly isEditing = computed(() => Boolean(this.id()));
  protected readonly heading = computed(() =>
    this.isEditing() ? 'تعديل المكان' : 'إضافة مكان جديد',
  );

  protected readonly week = signal<readonly WorkingDay[]>(createDefaultWeek());
  protected readonly images = signal<readonly MediaFile[]>([]);
  protected readonly products = signal<readonly PlaceProduct[]>([]);
  protected readonly isAddingProduct = signal(false);
  /** The product the dialog is changing, or `null` while one is being added. */
  protected readonly editedProduct = signal<PlaceProduct | null>(null);
  protected readonly productToRemove = signal<PlaceProduct | null>(null);
  protected readonly videos = signal<readonly MediaFile[]>([]);

  /** The control's value only reaches a computed through its value stream. */
  private readonly selectedPackage = toSignal(this.form.controls.package.valueChanges, {
    initialValue: this.form.controls.package.value,
  });
  protected readonly currentPackage = computed(() => this.selectedPackage());
  protected readonly productLimit = computed(() => PACKAGE_PRODUCT_LIMIT[this.currentPackage()]);
  protected readonly productDialogMode = computed<FormMode>(() =>
    this.editedProduct() ? 'edit' : 'create',
  );
  protected readonly editedProductDraft = computed<ProductDraft>(() => {
    const product = this.editedProduct();
    if (!product) {
      return EMPTY_PRODUCT_DRAFT;
    }
    const { name, price, currency, isAvailable, imageUrl, orderUrl } = product;
    return { name, price, currency, isAvailable, imageUrl, imageFile: null, orderUrl };
  });
  protected readonly removeProductCopy = computed(() => ({
    ...REMOVE_PRODUCT_COPY,
    message: `هل تريد حذف "${this.productToRemove()?.name ?? ''}" من قائمة المنتجات والخدمات؟`,
  }));
  protected readonly mediaLimit = computed(() => PACKAGE_MEDIA_LIMIT[this.currentPackage()]);
  protected readonly packageLabel = computed(() => PLACE_PACKAGE_LABEL[this.currentPackage()]);

  /** The detail page links to a section of this form through the route fragment. */
  private readonly section = toSignal(inject(ActivatedRoute).fragment);
  private readonly injector = inject(Injector);

  constructor() {
    resetDeliveryLinks(this.form.controls.deliveryLinks, DELIVERY_PLATFORM_OPTIONS);
    // The add route binds no id, and its empty string means "adding", the same as none.
    this.store.load(computed(() => this.id() || null));
    effect(() => {
      const section = this.section();
      if (section && this.store.isReady()) {
        untracked(() => this.scrollToSection(section));
      }
    });
    effect(() => {
      const place = this.store.editedPlace();
      if (place) {
        untracked(() => this.fillFrom(place));
      }
    });
  }

  /** The section only exists once the form has drawn, one render after it is ready. */
  private scrollToSection(section: string): void {
    afterNextRender(
      () => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }),
      { injector: this.injector },
    );
  }

  protected composeProduct(): void {
    this.editedProduct.set(null);
    this.isAddingProduct.set(true);
  }

  protected editProduct(product: PlaceProduct): void {
    this.editedProduct.set(product);
    this.isAddingProduct.set(true);
  }

  protected closeProductDialog(): void {
    this.isAddingProduct.set(false);
    this.editedProduct.set(null);
  }

  protected saveProduct(draft: ProductDraft): void {
    const edited = this.editedProduct();
    this.products.update((products) =>
      edited
        ? products.map((one) => (one.id === edited.id ? { ...one, ...draft } : one))
        : [...products, { ...draft, id: crypto.randomUUID() }],
    );
    this.closeProductDialog();
  }

  protected askToRemoveProduct(product: PlaceProduct): void {
    this.productToRemove.set(product);
  }

  protected cancelRemoveProduct(): void {
    this.productToRemove.set(null);
  }

  protected confirmRemoveProduct(): void {
    const product = this.productToRemove();
    if (!product) {
      return;
    }
    this.products.update((products) => products.filter((one) => one.id !== product.id));
    this.productToRemove.set(null);
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

  private fillFrom(place: PlaceDetail): void {
    fillPlaceForm(this.form, place);
    this.week.set(toWorkingWeek(place.workingHours));
    this.images.set(toSavedMediaFiles(place.images));
    this.videos.set(toSavedVideoFiles(place.videos));
    this.products.set(place.products);
  }
}
