import { QuickAction } from '../models/quick-action';

/** RTL puts the first card on the right: the blue one, as the design draws it. */
export const MERCHANT_QUICK_ACTIONS: readonly QuickAction[] = [
  {
    title: 'إضافة خدمة أو منتج',
    description: 'أضف خدمة جديدة أو منتج لمتجرك',
    route: '/merchant/products',
    icon: 'package',
    tileClass: 'bg-white/20 text-white',
    isHighlighted: true,
  },
  {
    title: 'إضافة عرض ترويجي',
    description: 'أنشئ عرضاً وتخفيضات لجذب المزيد من الزوار',
    route: '/merchant/offers',
    icon: 'tag-feather',
    tileClass: 'bg-accent text-white',
    isHighlighted: false,
  },
  {
    title: 'إضافة صور للمتجر',
    description: 'حدّث واجهة المتجر والصيدلية لتبدو مميزة للعملاء',
    route: '/merchant/media',
    icon: 'camera-feather',
    tileClass: 'bg-status-success text-white',
    isHighlighted: false,
  },
  {
    title: 'تعديل بيانات المتجر',
    description: 'ساعات العمل، أرقام التواصل، والموقع الجغرافي',
    route: '/merchant/store',
    icon: 'edit-outline',
    tileClass: 'bg-border text-text-primary',
    isHighlighted: false,
  },
];
