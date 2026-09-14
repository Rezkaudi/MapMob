import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CategoryKind } from '../../models/category-kind';

interface KindOption {
  readonly kind: CategoryKind;
  readonly label: string;
}

/** RTL: the main option sits on the right, the sub option on the left. */
const KIND_OPTIONS: readonly KindOption[] = [
  { kind: 'main', label: 'تصنيف رئيسي' },
  { kind: 'sub', label: 'تصنيف فرعي' },
];

@Component({
  selector: 'app-category-kind-picker',
  templateUrl: './category-kind-picker.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryKindPicker {
  readonly value = input.required<CategoryKind>();
  readonly valueChange = output<CategoryKind>();

  protected readonly options = KIND_OPTIONS;
}
