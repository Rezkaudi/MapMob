import { CategoryIcon } from './category-icon';
import { CategoryKind } from './category-kind';

export interface CategoryDraft {
  readonly name: string;
  readonly kind: CategoryKind;
  readonly parentId: string | null;
  readonly icon: CategoryIcon;
}
