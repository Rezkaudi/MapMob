import { TestBed } from '@angular/core/testing';
import { LanguageSettings } from '../../models/language-settings';
import { LanguageSettingsCard } from './language-settings-card';

function render() {
  const fixture = TestBed.createComponent(LanguageSettingsCard);
  fixture.componentRef.setInput('language', { defaultLanguage: 'ar', detectsDeviceLanguage: true });
  const saved: LanguageSettings[] = [];
  fixture.componentInstance.saved.subscribe((language) => saved.push(language));
  fixture.detectChanges();
  return { element: fixture.nativeElement as HTMLElement, saved };
}

describe('LanguageSettingsCard', () => {
  it('offers the languages and ticks the device language box', () => {
    const { element } = render();
    const language = element.querySelector('#default-language') as HTMLSelectElement;
    const detect = element.querySelector('#detect-device-language') as HTMLInputElement;

    expect(Array.from(language.options).map((option) => option.textContent?.trim())).toEqual([
      'العربية (Arabic)',
      'الإنجليزية (English)',
    ]);
    expect(detect.checked).toBe(true);
    expect(element.textContent).toContain('الكشف التلقائي عن لغة جهاز المستخدم');
    expect(element.textContent).toContain('تطبيق اللغة تلقائياً حسب إعدادات جهاز المستخدم.');
  });

  it('saves the language settings', () => {
    const { element, saved } = render();

    (element.querySelector('#detect-device-language') as HTMLInputElement).click();
    (element.querySelector('button[type="submit"]') as HTMLButtonElement).click();

    expect(saved).toEqual([{ defaultLanguage: 'ar', detectsDeviceLanguage: false }]);
  });
});
