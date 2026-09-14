import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { FieldLabel } from '../../../../shared/ui/field-label/field-label';
import { FileDropzone } from '../../../../shared/ui/file-dropzone/file-dropzone';
import { ProductDraft } from '../../models/product-draft';

/** Syrian pound, the only currency the design offers. */
const CURRENCY = 'ل.س';

@Component({
  selector: 'app-product-dialog',
  imports: [AppIcon, FieldLabel, FileDropzone],
  templateUrl: './product-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDialog {
  readonly submitted = output<ProductDraft>();
  readonly cancelled = output<void>();

  protected readonly currency = CURRENCY;
  protected readonly name = signal('');
  protected readonly price = signal('');
  protected readonly orderUrl = signal('');
  protected readonly imageUrl = signal('');
  protected readonly imageName = signal('');

  protected readonly isComplete = computed(
    () => this.name().trim().length > 0 && this.price().trim().length > 0,
  );

  protected onNameInput(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  protected onPriceInput(event: Event): void {
    this.price.set((event.target as HTMLInputElement).value);
  }

  protected onOrderUrlInput(event: Event): void {
    this.orderUrl.set((event.target as HTMLInputElement).value);
  }

  protected onImagePicked(files: readonly File[]): void {
    const [file] = files;
    if (!file) {
      return;
    }
    this.imageName.set(file.name);
    this.imageUrl.set(URL.createObjectURL(file));
  }

  protected removeImage(): void {
    this.imageName.set('');
    this.imageUrl.set('');
  }

  protected submit(): void {
    if (!this.isComplete()) {
      return;
    }
    this.submitted.emit({
      name: this.name().trim(),
      price: Number(this.price()),
      imageUrl: this.imageUrl(),
      orderUrl: this.orderUrl().trim(),
    });
  }
}
