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
  /** Empty when only the uploaded picture is known. */
  readonly icon: CategoryIcon;
  /** The picture the live server keeps for the icon. */
  readonly iconUrl: string | null;
  /** Any hex colour; the picker offers a fixed set. */
  readonly color: string;
  readonly placeCount: number;
  readonly status: CategoryStatus;
  readonly updatedAt: string;
}
