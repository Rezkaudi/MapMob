import { CategoryColor } from './category-color';
import { CategoryIcon } from './category-icon';
import { CategoryKind } from './category-kind';
import { CategoryStatus } from './category-status';

export interface Category {
  readonly id: string;
  readonly name: string;
  readonly kind: CategoryKind;
  /** Set only on a sub category. */
  readonly parentId: string | null;
  readonly parentName: string | null;
  readonly icon: CategoryIcon;
  readonly color: CategoryColor;
  readonly placeCount: number;
  readonly status: CategoryStatus;
  readonly updatedAt: string;
}
