import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { FormMode } from '../../../../shared/models/form-mode';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { SelectOption } from '../../../../shared/ui/select-field/select-option';
import { CategoryDraft } from '../../models/category-draft';
import { CategoryIcon } from '../../models/category-icon';
import { CategoryKind } from '../../models/category-kind';
import { CategoryFormCopy } from '../category-form-copy';
import { CategoryIconPicker } from '../category-icon-picker/category-icon-picker';
import { CategoryKindPicker } from '../category-kind-picker/category-kind-picker';

@Component({
  selector: 'app-category-form-dialog',
  imports: [AppIcon, CategoryIconPicker, CategoryKindPicker],
  templateUrl: './category-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormDialog {
  readonly mode = input.required<FormMode>();
  readonly copy = input.required<CategoryFormCopy>();
  readonly initialDraft = input.required<CategoryDraft>();
  readonly parentOptions = input.required<readonly SelectOption[]>();
  readonly isBusy = input<boolean>(false);
  readonly submitted = output<CategoryDraft>();
  readonly cancelled = output<void>();

  protected readonly name = linkedSignal(() => this.initialDraft().name);
  protected readonly kind = linkedSignal<CategoryKind>(() => this.initialDraft().kind);
  protected readonly icon = linkedSignal<CategoryIcon>(() => this.initialDraft().icon);
  /** A new sub category starts under the first main category, as the design shows. */
  protected readonly parentId = linkedSignal<string | null>(
    () => this.initialDraft().parentId ?? this.parentOptions()[0]?.value ?? null,
  );

  protected readonly isCreating = computed(() => this.mode() === 'create');
  protected readonly isSubCategory = computed(() => this.kind() === 'sub');
  protected readonly trimmedName = computed(() => this.name().trim());
  protected readonly canSubmit = computed(
    () =>
      this.trimmedName().length > 0 &&
      (!this.isSubCategory() || this.parentId() !== null) &&
      !this.isBusy(),
  );

  protected onNameInput(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  protected onParentChange(event: Event): void {
    this.parentId.set((event.target as HTMLSelectElement).value);
  }

  protected submit(event: Event): void {
    event.preventDefault();
    if (!this.canSubmit()) {
      return;
    }
    this.submitted.emit({
      name: this.trimmedName(),
      kind: this.kind(),
      parentId: this.isSubCategory() ? this.parentId() : null,
      icon: this.icon(),
    });
  }

  @HostListener('document:keydown.escape')
  protected cancelOnEscape(): void {
    this.cancelled.emit();
  }
}
