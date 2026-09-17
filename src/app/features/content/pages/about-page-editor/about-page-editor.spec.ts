import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ContentPageRepository } from '../../data/content-page.repository';
import { AboutPageDraft } from '../../models/about-page-draft';
import { buildAboutPage } from '../../testing/content-fixture';
import { AboutPageEditor } from './about-page-editor';

function render() {
  const saves: AboutPageDraft[] = [];
  const repository: Partial<ContentPageRepository> = {
    getAboutPage: () => of(buildAboutPage()),
    saveAboutPage: (draft) => {
      saves.push(draft);
      return of(buildAboutPage({ title: draft.title }));
    },
  };
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: ContentPageRepository, useValue: repository }],
  });
  const fixture = TestBed.createComponent(AboutPageEditor);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, saves };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

function type(element: HTMLElement, selector: string, value: string): void {
  const input = element.querySelector(selector) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

describe('AboutPageEditor page', () => {
  it('heads the page "عن التطبيق" under the content breadcrumb', () => {
    const { element } = render();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('عن التطبيق');
    expect(element.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('تعديل صفحة');
  });

  it('draws the four sections in the design order, filled from the saved page', () => {
    const { element } = render();

    expect((element.querySelector('#page-title') as HTMLInputElement).value).toBe('عن التطبيق');
    expect(element.querySelector('app-about-banner-field img')?.getAttribute('src')).toBe(
      'assets/images/about-app-banner.png',
    );
    expect(element.querySelector('[contenteditable="true"]')?.innerHTML).toContain('أداتك الشاملة');
    expect(element.textContent).toContain('معلومات التواصل');
    const channels = Array.from(element.querySelectorAll('app-contact-channel-field label')).map(
      (label) => label.textContent?.trim(),
    );
    expect(channels).toEqual([
      'رقم الهاتف الرسمي',
      'البريد الإلكتروني',
      'الموقع الجغرافي / المقر الرئيسي',
    ]);
    expect((element.querySelector('#about-address') as HTMLInputElement).value).toBe(
      'طرطوس، شارع الثورة',
    );
  });

  it('publishes the edited fields, and removes the banner when it was deleted', async () => {
    const { fixture, element, saves } = render();
    type(element, '#about-phone', '+963 944 000 111');
    buttonNamed(element, 'حذف').click();
    fixture.detectChanges();

    buttonNamed(element, 'حفظ التغييرات').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(saves).toHaveLength(1);
    expect(saves[0].phone).toBe('+963 944 000 111');
    expect(saves[0].isBannerRemoved).toBe(true);
    expect(saves[0].status).toBe('published');
    expect(element.querySelector('app-toast')?.textContent).toContain('تم حفظ التغييرات');
  });

  it('does not save a wrong email, and says why', async () => {
    const { fixture, element, saves } = render();
    type(element, '#about-email', 'mapmob');

    buttonNamed(element, 'حفظ كمسودة').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(saves).toEqual([]);
    expect(element.textContent).toContain('اكتب بريداً إلكترونياً صحيحاً');
  });
});
