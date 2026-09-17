import { ContactPageFormValue } from '../../state/contact-page-form-group';

export interface ContactSocialChannel {
  readonly field: keyof Pick<
    ContactPageFormValue,
    'facebookUrl' | 'instagramUrl' | 'telegramUrl' | 'whatsappUrl'
  >;
  readonly label: string;
  readonly inputId: string;
  readonly brandIcon: string;
}

/** The official accounts, in the design order. */
export const CONTACT_SOCIAL_CHANNELS: readonly ContactSocialChannel[] = [
  {
    field: 'facebookUrl',
    label: 'Facebook',
    inputId: 'contact-facebook',
    brandIcon: 'brand-facebook',
  },
  {
    field: 'instagramUrl',
    label: 'Instagram',
    inputId: 'contact-instagram',
    brandIcon: 'brand-instagram',
  },
  {
    field: 'telegramUrl',
    label: 'Telegram',
    inputId: 'contact-telegram',
    brandIcon: 'brand-telegram',
  },
  {
    field: 'whatsappUrl',
    label: 'WhatsApp',
    inputId: 'contact-whatsapp',
    brandIcon: 'brand-whatsapp',
  },
];
