import { Category } from '../models/category';
import { CategoryColor } from '../models/category-color';
import { CategoryIcon } from '../models/category-icon';

const SEED_DATE = '2024-01-12T00:00:00.000Z';
const PLACES_PER_MAIN_CATEGORY = 50;
const PLACES_PER_SUB_CATEGORY = 12;
const SUSPENDED_CATEGORY = 'حلاقة وتجميل';

interface MainCategorySeed {
  readonly name: string;
  readonly icon: CategoryIcon;
  readonly color: CategoryColor;
  readonly subNames: readonly string[];
}

/** Restaurants lead, as in the design; sub categories share their parent's icon. */
const MAIN_CATEGORY_SEEDS: readonly MainCategorySeed[] = [
  {
    name: 'مطاعم',
    icon: 'utensils-crossed',
    color: '#FF8104',
    subNames: ['مطاعم بحرية', 'مطاعم شعبية', 'وجبات سريعة'],
  },
  { name: 'مقاهي', icon: 'coffee', color: '#03732B', subNames: ['محامص', 'مقاهي شعبية'] },
  { name: 'مكتبات', icon: 'library-big', color: '#5977FF', subNames: ['قرطاسية', 'كتب مستعملة'] },
  { name: 'نوادي رياضية', icon: 'dumbbell', color: '#0583EC', subNames: ['صالات حديد', 'مسابح'] },
  { name: 'تسوق', icon: 'shopping-cart', color: '#F4D400', subNames: ['سوبرماركت', 'ملابس', 'هدايا'] },
  {
    name: 'صحة وجمال',
    icon: 'pill',
    color: '#10B981',
    subNames: ['صيدليات', 'حلاقة وتجميل', 'عطور'],
  },
];

function buildSeed(): Category[] {
  const mains = MAIN_CATEGORY_SEEDS.map((seed, index) => ({
    id: `category-${index + 1}`,
    seed,
  }));
  const mainCategories: Category[] = mains.map(({ id, seed }) => ({
    id,
    name: seed.name,
    kind: 'main',
    parentId: null,
    parentName: null,
    icon: seed.icon,
    color: seed.color,
    placeCount: PLACES_PER_MAIN_CATEGORY,
    status: 'active',
    updatedAt: SEED_DATE,
  }));
  const subCategories: Category[] = mains.flatMap(({ id, seed }) =>
    seed.subNames.map((name, index) => ({
      id: `${id}-sub-${index + 1}`,
      name,
      kind: 'sub',
      parentId: id,
      parentName: seed.name,
      icon: seed.icon,
      color: seed.color,
      placeCount: PLACES_PER_SUB_CATEGORY,
      status: name === SUSPENDED_CATEGORY ? 'suspended' : 'active',
      updatedAt: SEED_DATE,
    })),
  );
  return [...mainCategories, ...subCategories];
}

export const CATEGORY_MOCK_SEED: readonly Category[] = buildSeed();
