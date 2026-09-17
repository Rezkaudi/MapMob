import { AppLanguage } from './app-language';

export interface LanguageSettings {
  readonly defaultLanguage: AppLanguage;
  readonly detectsDeviceLanguage: boolean;
}
