import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ContentPageRepository } from '../../data/content-page.repository';
import { ContactPageDraft } from '../../models/contact-page-draft';
import { buildContactPage } from '../../testing/content-fixture';
import { ContactPageEditor } from './contact-page-editor';

function render() {
  const saves: ContactPageDraft[] = [];
  const repository: Partial<ContentPageRepository> = {
    getContactPage: () => of(buildContactPage()),
    saveContactPage: (draft) => {
      saves.push(draft);
      return of(buildContactPage());
    },
  };
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: ContentPageRepository, useValue: repository }],
  });
  const fixture = TestBed.createComponent(ContactPageEditor);
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

describe('ContactPageEditor page', () => {
  it('heads the page "تواصل معنا"', () => {
    const { element } = render();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('تواصل معنا');
  });

  it('draws the introduction with its hint, then the support and social channels', () => {
    const { element } = render();

    expect(element.textContent).toContain(
      'هذا النص يظهر للمستخدم في أعلى شاشة «تواصل معنا» أسفل العنوان الرئيسي مباشرة ليوضح قنوات المساعدة.',
    );
    expect((element.querySelector('#contact-introduction') as HTMLInputElement).value).toBe(
      buildContactPage().introduction,
    );
    expect(element.textContent).toContain('معلومات الدعم المباشر');
    expect(element.textContent).toContain('معلومات التواصل الاجتماعي(حسابات MapMob الرسمية)');
    const channels = Array.from(element.querySelectorAll('app-contact-channel-field label')).map(
      (label) => label.firstChild?.textContent?.trim(),
    );
    expect(channels).toEqual([
      'الدعم الهاتفي',
      'دعم البريد الالكتروني',
      'Facebook',
      'Instagram',
      'Telegram',
      'WhatsApp',
    ]);
    expect(element.querySelectorAll('app-contact-channel-field img')).toHaveLength(4);
  });

  it('publishes the edited links', async () => {
    const { fixture, element, saves } = render();
    type(element, '#contact-whatsapp', 'https://wa.me/963933123456');

    buttonNamed(element, 'حفظ التغييرات').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(saves).toEqual([
      { ...buildContactPage({ whatsappUrl: 'https://wa.me/963933123456' }), status: 'published' },
    ]);
  });

  it('does not save a link that is not a web address, and says why', async () => {
    const { fixture, element, saves } = render();
    type(element, '#contact-instagram', 'instagram');

    buttonNamed(element, 'حفظ التغييرات').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(saves).toEqual([]);
    expect(element.textContent).toContain('اكتب رابطاً يبدأ بـ https://');
  });
});
