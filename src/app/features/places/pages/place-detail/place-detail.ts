import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfirmAction, statusAfter } from '../../../../shared/models/confirm-action';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { Badge, BadgeTone } from '../../../../shared/ui/badge/badge';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { InfoCard } from '../../../../shared/ui/info-card/info-card';
import { Toast } from '../../../../shared/ui/toast/toast';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { PLACE_PACKAGE_LABEL } from '../../models/place-package';
import { PLACE_STATUS_LABEL, PlaceStatus } from '../../models/place-status';
import { FormMode } from '../../../../shared/models/form-mode';
import { PlaceEditSection } from '../../models/place-edit-section';
import { PlaceProduct } from '../../models/place-product';
import { ProductDraft } from '../../../../shared/models/product-draft';
import { ProductDialog } from '../../../../shared/ui/product-dialog/product-dialog';
import { buildRemoveProductCopy } from '../../../../shared/ui/product-dialog/product-confirm-copy';
import { EMPTY_PRODUCT_DRAFT } from '../../../../shared/models/empty-product-draft';
import { PlaceDetailStore } from '../../state/place-detail.store';
import { PlaceDetailSkeleton } from './place-detail-skeleton/place-detail-skeleton';
import { PlaceGallery } from './place-gallery/place-gallery';
import { PlaceContactCard } from './place-contact-card/place-contact-card';
import { PlaceHoursCard } from './place-hours-card/place-hours-card';
import { PlaceLocationCard } from './place-location-card/place-location-card';
import { PlaceOffersCard } from './place-offers-card/place-offers-card';
import { PlaceProductsCard } from './place-products-card/place-products-card';
import { buildPlaceConfirmCopy } from '../../ui/place-confirm-copy';
import { PlaceVideosCard } from './place-videos-card/place-videos-card';

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
    ConfirmActionDialog,
    ErrorState,
    InfoCard,
    PlaceDetailSkeleton,
    PlaceGallery,
    PlaceContactCard,
    PlaceHoursCard,
    PlaceLocationCard,
    PlaceOffersCard,
    PlaceProductsCard,
    PlaceVideosCard,
    ProductDialog,
    Toast,
    ArabicDatePipe,
    RouterLink,
  ],
  templateUrl: './place-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceDetail {
  /** Bound from the route parameter by `withComponentInputBinding`. */
  readonly id = input.required<string>();

  private readonly router = inject(Router);

  protected readonly store = inject(PlaceDetailStore);
  protected readonly statusLabel = PLACE_STATUS_LABEL;
  protected readonly statusTone = STATUS_TONE;
  protected readonly statusTextClass = STATUS_TEXT_CLASS;
  protected readonly packageLabel = PLACE_PACKAGE_LABEL;

  protected readonly place = this.store.place;
  protected readonly isSuspended = computed(() => this.place()?.status === 'suspended');
  protected readonly pendingAction = signal<ConfirmAction | null>(null);
  /** The product the dialog is changing, and the one waiting on a delete answer. */
  protected readonly editedProduct = signal<PlaceProduct | null>(null);
  protected readonly isProductDialogOpen = signal(false);
  protected readonly productToRemove = signal<PlaceProduct | null>(null);
  protected readonly productDialogMode = computed<FormMode>(() =>
    this.editedProduct() ? 'edit' : 'create',
  );
  protected readonly editedProductDraft = computed<ProductDraft>(() => {
    const product = this.editedProduct() ?? EMPTY_PRODUCT_DRAFT;
    const { name, price, currency, isAvailable, imageUrl, orderUrl } = product;
    return { name, price, currency, isAvailable, imageUrl, imageFile: null, orderUrl };
  });
  protected readonly removeProductCopy = computed(() => {
    const product = this.productToRemove();
    return product ? buildRemoveProductCopy(product.name) : null;
  });
  protected readonly confirmCopy = computed(() => {
    const action = this.pendingAction();
    const place = this.place();
    return action && place ? buildPlaceConfirmCopy(action, place.name) : null;
  });

  constructor() {
    this.store.loadPlace(this.id);
  }

  protected reload(): void {
    this.store.loadPlace(this.id());
  }

  /** Every edit on this page opens the form, scrolled to the matching section. */
  protected goToEdit(section: PlaceEditSection): void {
    this.router.navigate(['/admin/places', this.id(), 'edit'], { fragment: section });
  }

  protected goToNewOffer(): void {
    this.router.navigate(['/admin/offers', 'new']);
  }

  protected composeProduct(): void {
    this.editedProduct.set(null);
    this.isProductDialogOpen.set(true);
  }

  protected editProduct(product: PlaceProduct): void {
    this.editedProduct.set(product);
    this.isProductDialogOpen.set(true);
  }

  protected closeProductDialog(): void {
    this.isProductDialogOpen.set(false);
    this.editedProduct.set(null);
  }

  protected saveProduct(draft: ProductDraft): void {
    const product = this.editedProduct();
    if (product) {
      this.store.saveProduct(product.id, draft);
    } else {
      this.store.addProduct(draft);
    }
    this.closeProductDialog();
  }

  protected changeProductAvailability(product: PlaceProduct): void {
    this.store.toggleProductAvailability(product.id);
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
    this.store.removeProduct(product.id);
    this.productToRemove.set(null);
  }

  protected askForStatusChange(): void {
    this.pendingAction.set(this.isSuspended() ? 'activate' : 'suspend');
  }

  protected askForDelete(): void {
    this.pendingAction.set('delete');
  }

  protected cancelAction(): void {
    this.pendingAction.set(null);
    this.store.clearSaveError();
  }

  protected async confirmAction(): Promise<void> {
    const action = this.pendingAction();
    const place = this.place();
    if (!action || !place) {
      return;
    }
    if (action === 'delete') {
      await this.deleteThenLeave(place.id);
      return;
    }
    if (await this.store.changeStatus(place.id, statusAfter(action))) {
      this.pendingAction.set(null);
    }
  }

  private async deleteThenLeave(id: string): Promise<void> {
    if (await this.store.deletePlace(id)) {
      this.pendingAction.set(null);
      await this.router.navigate(['/admin/places']);
    }
  }
}
