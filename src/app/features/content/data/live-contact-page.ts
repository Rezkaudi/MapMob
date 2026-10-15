import { LiveContentPage } from './live-content-page';

export interface LiveContactPage extends LiveContentPage {
  readonly introduction: string | null;
  readonly supportPhone: string | null;
  readonly supportEmail: string | null;
  readonly facebookUrl: string | null;
  readonly instagramUrl: string | null;
  readonly telegramUrl: string | null;
  readonly whatsappUrl: string | null;
}
