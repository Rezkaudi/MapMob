import {
  Baby,
  Bath,
  Bed,
  Beef,
  Beer,
  Book,
  Briefcase,
  Building2,
  Bus,
  CakeSlice,
  Camera,
  Car,
  ChefHat,
  Coffee,
  Cookie,
  Croissant,
  Dog,
  Dumbbell,
  Fish,
  Flower,
  Fuel,
  Gamepad2,
  Gem,
  Gift,
  Glasses,
  GraduationCap,
  Hammer,
  HeartPulse,
  Hospital,
  Hotel,
  IceCreamCone,
  Key,
  Laptop,
  Leaf,
  LibraryBig,
  Music,
  Paintbrush,
  Palette,
  PawPrint,
  Pill,
  Pizza,
  Plane,
  Printer,
  Salad,
  Sandwich,
  Scissors,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Soup,
  SprayCan,
  Stethoscope,
  Store,
  Syringe,
  Ticket,
  Truck,
  UtensilsCrossed,
  Watch,
  Wine,
  Wrench,
} from 'lucide';
import { LucideIconData } from '@lucide/angular';

/** A Lucide icon name, such as `coffee` or `utensils-crossed`. */
export type CategoryIcon = string;

/** One entry of the picker: a Lucide icon with the Arabic name the admin searches by. */
export interface CategoryIconEntry {
  /** The Lucide icon name, which is also what a category stores. */
  readonly name: string;
  readonly label: string;
  /** English words the admin may type instead of the Arabic label. */
  readonly keywords: readonly string[];
  readonly data: LucideIconData;
}

/** Wraps a raw Lucide node list as the drawing data the renderer takes. */
function icon(
  name: string,
  label: string,
  keywords: readonly string[],
  node: LucideIconData['node'],
): CategoryIconEntry {
  return { name, label, keywords, data: { name, node } };
}

/**
 * The first ten are the icons the design draws, in its order — RTL lays them out as two rows
 * of five. The rest widen the library so the search box has something to search.
 */
export const CATEGORY_ICONS: readonly CategoryIconEntry[] = [
  icon('utensils-crossed', 'مطاعم', ['restaurant', 'food'], UtensilsCrossed),
  icon('coffee', 'مقاهي', ['cafe', 'drink'], Coffee),
  icon('library-big', 'مكتبات', ['library', 'books'], LibraryBig),
  icon('dumbbell', 'نوادي رياضية', ['gym', 'sport', 'fitness'], Dumbbell),
  icon('shopping-cart', 'تسوق', ['cart', 'shopping', 'market'], ShoppingCart),
  icon('pill', 'صيدليات', ['pharmacy', 'medicine'], Pill),
  icon('store', 'متاجر', ['store', 'shop'], Store),
  icon('shirt', 'ملابس', ['clothes', 'fashion'], Shirt),
  icon('scissors', 'حلاقة وتجميل', ['barber', 'salon', 'beauty'], Scissors),
  icon('gift', 'هدايا', ['gift', 'present'], Gift),

  icon('pizza', 'بيتزا', ['pizza', 'fastfood'], Pizza),
  icon('sandwich', 'وجبات سريعة', ['sandwich', 'fastfood'], Sandwich),
  icon('beef', 'مشاوي', ['grill', 'meat'], Beef),
  icon('fish', 'مأكولات بحرية', ['seafood', 'fish'], Fish),
  icon('soup', 'شوربات', ['soup'], Soup),
  icon('salad', 'مأكولات صحية', ['salad', 'healthy'], Salad),
  icon('chef-hat', 'مطابخ', ['chef', 'kitchen'], ChefHat),
  icon('croissant', 'مخابز', ['bakery', 'bread'], Croissant),
  icon('cake-slice', 'حلويات', ['cake', 'sweets', 'dessert'], CakeSlice),
  icon('cookie', 'محامص ومكسرات', ['nuts', 'snacks'], Cookie),
  icon('ice-cream-cone', 'مثلجات', ['icecream'], IceCreamCone),
  icon('wine', 'مشروبات', ['drinks', 'wine'], Wine),
  icon('beer', 'بار', ['bar', 'beer'], Beer),

  icon('shopping-bag', 'مراكز تجارية', ['mall', 'bag'], ShoppingBag),
  icon('gem', 'مجوهرات', ['jewelry', 'gold'], Gem),
  icon('watch', 'ساعات', ['watch', 'clock'], Watch),
  icon('glasses', 'نظارات', ['optics', 'glasses'], Glasses),
  icon('baby', 'مستلزمات أطفال', ['baby', 'kids'], Baby),
  icon('book', 'قرطاسية', ['stationery', 'book'], Book),
  icon('ticket', 'ترفيه', ['tickets', 'entertainment'], Ticket),
  icon('gamepad-2', 'ألعاب', ['games', 'gaming'], Gamepad2),
  icon('music', 'موسيقى', ['music'], Music),
  icon('palette', 'فنون', ['art', 'paint'], Palette),
  icon('camera', 'تصوير', ['photo', 'camera'], Camera),
  icon('laptop', 'إلكترونيات', ['electronics', 'computer'], Laptop),
  icon('printer', 'طباعة', ['print', 'copy'], Printer),
  icon('flower', 'زهور', ['flowers', 'florist'], Flower),
  icon('leaf', 'مشاتل', ['plants', 'garden'], Leaf),

  icon('stethoscope', 'عيادات', ['clinic', 'doctor'], Stethoscope),
  icon('hospital', 'مشافي', ['hospital'], Hospital),
  icon('heart-pulse', 'مراكز صحية', ['health', 'heart'], HeartPulse),
  icon('syringe', 'مخابر', ['lab', 'analysis'], Syringe),
  icon('spray-can', 'عطور', ['perfume'], SprayCan),
  icon('bath', 'حمامات', ['spa', 'bath'], Bath),
  icon('dog', 'حيوانات أليفة', ['pets', 'vet'], Dog),
  icon('paw-print', 'بيطري', ['vet', 'animals'], PawPrint),

  icon('car', 'سيارات', ['car', 'auto'], Car),
  icon('wrench', 'ورش صيانة', ['repair', 'garage'], Wrench),
  icon('fuel', 'محطات وقود', ['fuel', 'gas'], Fuel),
  icon('truck', 'شحن وتوصيل', ['delivery', 'shipping'], Truck),
  icon('bus', 'نقل', ['bus', 'transport'], Bus),
  icon('plane', 'سفر وسياحة', ['travel', 'flight'], Plane),
  icon('hotel', 'فنادق', ['hotel'], Hotel),
  icon('bed', 'شقق مفروشة', ['rooms', 'apartments'], Bed),
  icon('building-2', 'عقارات', ['real estate', 'building'], Building2),
  icon('key', 'خدمات عقارية', ['keys', 'rent'], Key),
  icon('hammer', 'مواد بناء', ['construction', 'tools'], Hammer),
  icon('paintbrush', 'دهانات وديكور', ['paint', 'decor'], Paintbrush),
  icon('briefcase', 'أعمال ومكاتب', ['office', 'business'], Briefcase),
  icon('graduation-cap', 'تعليم', ['school', 'education'], GraduationCap),
];

/** The icon the design shows picked when the add dialog opens. */
export const DEFAULT_CATEGORY_ICON = CATEGORY_ICONS[0].name;

export function findCategoryIcon(name: string): CategoryIconEntry | null {
  return CATEGORY_ICONS.find((entry) => entry.name === name) ?? null;
}

/** Matches the Arabic label, the Lucide name or an English keyword, in any case. */
export function searchCategoryIcons(term: string): readonly CategoryIconEntry[] {
  const needle = term.trim().toLowerCase();
  if (!needle) {
    return CATEGORY_ICONS;
  }
  return CATEGORY_ICONS.filter(
    (entry) =>
      entry.label.includes(term.trim()) ||
      entry.name.includes(needle) ||
      entry.keywords.some((keyword) => keyword.includes(needle)),
  );
}
