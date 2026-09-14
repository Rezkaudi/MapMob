import { Category } from './category';

/** A choice in the parent pickers: only main categories can own sub categories. */
export type MainCategory = Pick<Category, 'id' | 'name'>;
