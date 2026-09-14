import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import {
  CATEGORY_ICON_LABEL,
  CATEGORY_ICONS,
  CategoryIcon,
  categoryIconAssetName,
} from '../../models/category-icon';

interface IconOption {
  readonly icon: CategoryIcon;
  readonly assetName: string;
  readonly label: string;
}

const ICON_OPTIONS: readonly IconOption[] = CATEGORY_ICONS.map((icon) => ({
  icon,
  assetName: categoryIconAssetName(icon),
  label: CATEGORY_ICON_LABEL[icon],
}));

@Component({
  selector: 'app-category-icon-picker',
  imports: [AppIcon],
  templateUrl: './category-icon-picker.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryIconPicker {
  readonly value = input.required<CategoryIcon>();
  readonly valueChange = output<CategoryIcon>();

  protected readonly options = ICON_OPTIONS;
}
