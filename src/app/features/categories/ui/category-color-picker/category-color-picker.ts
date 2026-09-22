import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideDynamicIcon, LucideIconData } from '@lucide/angular';
import { Check } from 'lucide';
import { CATEGORY_COLORS, CategoryColor } from '../../models/category-color';

const TICK: LucideIconData = { name: 'check', node: Check };

@Component({
  selector: 'app-category-color-picker',
  imports: [LucideDynamicIcon],
  templateUrl: './category-color-picker.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryColorPicker {
  readonly value = input.required<CategoryColor>();
  readonly valueChange = output<CategoryColor>();

  protected readonly colors = CATEGORY_COLORS;
  protected readonly tick = TICK;
}
