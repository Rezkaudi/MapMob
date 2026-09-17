import { NotificationAlertKind } from '../../models/notification-alert-kind';

interface NotificationAlertCopy {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  /** Glyph colour; the tile behind it is the same colour at 16%. */
  readonly toneClasses: string;
}

export const NOTIFICATION_ALERT_COPY: Record<NotificationAlertKind, NotificationAlertCopy> = {
  'new-complaint': {
    title: 'بلاغ جديد عن متجر أو محتوى',
    description: 'تنبيه فوري عند تقديم مستخدم لشكوى أو بلاغ يحتاج المراجعة',
    icon: 'alert-flag',
    toneClasses: 'bg-closed/16 text-closed',
  },
  'place-awaiting-approval': {
    title: 'متجر أو شركة جديدة بانتظار الاعتماد',
    description: 'إشعار عند إتمام تسجيل متجر جديد وطلب المراجعة للنشر',
    icon: 'alert-monitor',
    toneClasses: 'bg-primary/16 text-primary',
  },
  'review-reported': {
    title: 'تقييم تم الإبلاغ عنه كمخالف',
    description: 'إشعار فوري عند الإبلاغ عن تعليق مسيء أو غير لائق للمراجعة',
    icon: 'alert-star',
    toneClasses: 'bg-accent/16 text-accent',
  },
  'subscription-expiring': {
    title: 'اشتراك تجاري على وشك الانتهاء',
    description: 'تنبيه قبل 7 أيام من انتهاء خطة الاشتراك للمتجر للتذكير والتجديد',
    icon: 'alert-clock',
    toneClasses: 'bg-text-secondary/16 text-text-secondary',
  },
  'new-payment': {
    title: 'عملية دفع جديدة',
    description: 'إشعار بتسديد رسوم الاشتراك أو ترقية باقة التاجر بنجاح',
    icon: 'alert-card',
    toneClasses: 'bg-status-success/16 text-status-success',
  },
};
