import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { FormMode } from '../../models/form-mode';
import { CurrencyCode } from '../../money/currency-code';
import { AppIcon } from '../app-icon/app-icon';
import { CurrencySelect } from '../currency-select/currency-select';
import { FieldLabel } from '../field-label/field-label';
import { FileDropzone } from '../file-dropzone/file-dropzone';
import { FormDialogFrame } from '../form-dialog-frame/form-dialog-frame';
import { EMPTY_PRODUCT_DRAFT } from '../../models/empty-product-draft';
import { PRODUCT_AVAILABILITY_CHOICES, availabilityValue } from '../../models/product-availability';
import { ProductDraft } from '../../models/product-draft';
import { PRODUCT_FORM_COPY } from './product-form-copy';

const AVAILABLE = 'available';
/** Stands in for a file name when the picture came back from the server. */
const SAVED_IMAGE_LABEL = 'الصورة الحالية';

@Component({
  selector: 'app-product-dialog',
  imports: [AppIcon, CurrencySelect, FieldLabel, FileDropzone, FormDialogFrame],
  templateUrl: './product-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDialog {
  readonly mode = input<FormMode>('create');
  /** What the fields start with. Editing passes the product being changed. */
  readonly initialDraft = input<ProductDraft>(EMPTY_PRODUCT_DRAFT);
  /** The merchant frame drops the line under the order link. */
  readonly isOrderUrlHintVisible = input<boolean>(true);
  readonly submitted = output<ProductDraft>();
  readonly cancelled = output<void>();

  protected readonly copy = computed(() => PRODUCT_FORM_COPY[this.mode()]);
  protected readonly availabilityChoices = PRODUCT_AVAILABILITY_CHOICES;
  protected readonly name = linkedSignal(() => this.initialDraft().name);
  protected readonly price = linkedSignal(() => priceText(this.initialDraft().price));
  protected readonly currency = linkedSignal(() => this.initialDraft().currency);
  protected readonly orderUrl = linkedSignal(() => this.initialDraft().orderUrl);
  protected readonly availability = linkedSignal(() =>
    availabilityValue(this.initialDraft().isAvailable),
  );
  protected readonly imageUrl = linkedSignal(() => this.initialDraft().imageUrl);
  protected readonly pickedImageName = signal('');
  private readonly pickedImageFile = signal<File | null>(null);
  protected readonly imageName = computed(() => this.pickedImageName() || SAVED_IMAGE_LABEL);

  protected readonly isComplete = computed(
    () => this.name().trim().length > 0 && this.price().trim().length > 0,
  );

  protected onNameInput(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  protected onPriceInput(event: Event): void {
    this.price.set((event.target as HTMLInputElement).value);
  }

  protected onCurrencyChange(currency: CurrencyCode): void {
    this.currency.set(currency);
  }

  protected onAvailabilityChange(event: Event): void {
    this.availability.set((event.target as HTMLSelectElement).value);
  }

  protected onOrderUrlInput(event: Event): void {
    this.orderUrl.set((event.target as HTMLInputElement).value);
  }

  protected onImagePicked(files: readonly File[]): void {
    const [file] = files;
    if (!file) {
      return;
    }
    this.pickedImageName.set(file.name);
    this.pickedImageFile.set(file);
    this.imageUrl.set(URL.createObjectURL(file));
  }

  protected removeImage(): void {
    this.pickedImageName.set('');
    this.pickedImageFile.set(null);
    this.imageUrl.set('');
  }

  protected submit(): void {
    if (!this.isComplete()) {
      return;
    }
    this.submitted.emit({
      name: this.name().trim(),
      price: Number(this.price()),
      currency: this.currency(),
      isAvailable: this.availability() === AVAILABLE,
      imageUrl: this.imageUrl(),
      imageFile: this.pickedImageFile(),
      orderUrl: this.orderUrl().trim(),
    });
  }
}

/** An empty box reads better than "0" when a product is being added. */
function priceText(price: number): string {
  return price > 0 ? String(price) : '';
}
