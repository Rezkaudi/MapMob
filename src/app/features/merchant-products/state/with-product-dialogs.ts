import { Signal, computed, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { tap } from 'rxjs';
import { EMPTY_PRODUCT_DRAFT } from '../../../shared/models/empty-product-draft';
import { FormMode } from '../../../shared/models/form-mode';
import { ProductDraft } from '../../../shared/models/product-draft';
import { PlanQuota } from '../../../shared/models/plan-quota';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { buildRemoveProductCopy } from '../../../shared/ui/product-dialog/product-confirm-copy';
import { MerchantProductRepository } from '../data/merchant-product.repository';
import { MerchantProduct } from '../models/merchant-product';
import { ProductDialogRequest } from '../models/product-dialog-request';
import { toProductDraft } from './product-draft-mapping';

interface ProductFormDialog {
  readonly mode: FormMode;
  readonly draft: ProductDraft;
}

/** What the dialogs need from the catalog feature they sit on. */
type CatalogQuota = { quota: Signal<PlanQuota | null> };
type CatalogEditing = {
  addToCatalog(product: MerchantProduct): void;
  replaceInCatalog(product: MerchantProduct): void;
  removeFromCatalog(id: string): void;
};

/** The add/edit form and the delete question, each saved straight into the loaded catalog. */
export function withProductDialogs() {
  return signalStoreFeature(
    { props: type<CatalogQuota>(), methods: type<CatalogEditing>() },
    withState<{ readonly dialog: ProductDialogRequest | null }>({ dialog: null }),
    withSaveStatus(),
    withComputed(({ dialog }) => ({
      formDialog: computed<ProductFormDialog | null>(() => {
        const request = dialog();
        if (request?.kind !== 'form') {
          return null;
        }
        return request.product
          ? { mode: 'edit', draft: toProductDraft(request.product) }
          : { mode: 'create', draft: EMPTY_PRODUCT_DRAFT };
      }),
      deleteCopy: computed(() => {
        const request = dialog();
        return request?.kind === 'delete' ? buildRemoveProductCopy(request.product.name) : null;
      }),
    })),
    withMethods((store, repository = inject(MerchantProductRepository)) => {
      const closeWhenSaved = (isSaved: boolean) => {
        if (isSaved) {
          patchState(store, { dialog: null });
        }
      };
      return {
        openCreate(): void {
          if (!store.quota()?.isFull) {
            patchState(store, { dialog: { kind: 'form', product: null } });
          }
        },
        openEdit(product: MerchantProduct): void {
          patchState(store, { dialog: { kind: 'form', product } });
        },
        openDelete(product: MerchantProduct): void {
          patchState(store, { dialog: { kind: 'delete', product } });
        },
        closeDialog(): void {
          patchState(store, { dialog: null });
          store.clearSaveError();
        },
        async submitDraft(draft: ProductDraft): Promise<void> {
          const request = store.dialog();
          if (request?.kind !== 'form') {
            return;
          }
          const save = request.product
            ? repository
                .updateProduct(request.product.id, draft)
                .pipe(tap((saved) => store.replaceInCatalog(saved)))
            : repository.createProduct(draft).pipe(tap((saved) => store.addToCatalog(saved)));
          closeWhenSaved(await store.runSave(save));
        },
        async confirmDelete(): Promise<void> {
          const request = store.dialog();
          if (request?.kind !== 'delete') {
            return;
          }
          const { id } = request.product;
          const remove = repository.deleteProduct(id).pipe(tap(() => store.removeFromCatalog(id)));
          closeWhenSaved(await store.runSave(remove));
        },
      };
    }),
  );
}
