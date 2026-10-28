import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { ContentPageRepository } from '../../data/content-page.repository';
import { ProviderJoinPageDraft } from '../../models/provider-join-page-draft';
import { buildProviderJoinPage } from '../../testing/content-fixture';
import { ProviderJoinPageEditor } from './provider-join-page-editor';

function render(overrides: Partial<ContentPageRepository> = {}) {
  const saves: ProviderJoinPageDraft[] = [];
  const repository: Partial<ContentPageRepository> = {
    getProviderJoinPage: () => of(buildProviderJoinPage()),
    saveProviderJoinPage: ({ status, ...page }) => {
      saves.push({ ...page, status });
      return of(page);
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: ContentPageRepository, useValue: repository }],
  });
  const fixture = TestBed.createComponent(ProviderJoinPageEditor);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, saves };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement | undefined {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  );
}

function typeInto(element: HTMLElement, selector: string, value: string): void {
  const input = element.querySelector(selector) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

async function settle(fixture: { whenStable(): Promise<unknown>; detectChanges(): void }) {
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('ProviderJoinPageEditor page', () => {
  it('names the page in the heading, under a breadcrumb back to the content list', () => {
    const { element } = render();
    const crumb = element.querySelector('nav[aria-label="مسار الصفحة"]') as HTMLElement;

    expect(crumb.querySelector('a')?.getAttribute('href')).toBe('/admin/content');
    expect(crumb.querySelector('a')?.textContent?.trim()).toBe('إدارة المحتوى');
    expect(crumb.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('تعديل صفحة');
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('انضم إلينا كمقدم خدمة');
    expect(element.textContent).toContain('تعديل المحتوى الذي يظهر للمستخدمين داخل تطبيق MapMob.');
  });

  it('fills the title and the form link from the saved page', () => {
    const { element } = render();

    expect((element.querySelector('#page-title') as HTMLInputElement).value).toBe(
      'انضم إلينا كمقدم خدمة',
    );
    expect((element.querySelector('#registration-form-url') as HTMLInputElement).value).toBe(
      'https://docs.google.com/forms/d/mapmob-join',
    );
  });

  it('offers only save and cancel, as the design draws', () => {
    const { element } = render();
    const actions = Array.from(
      element.querySelectorAll('app-form-action-bar button, app-form-action-bar a'),
      (action) => action.textContent?.trim(),
    );

    expect(actions).toEqual(['حفظ التغييرات', 'إلغاء']);
  });

  it('publishes the changes and confirms it', async () => {
    const { fixture, element, saves } = render();
    typeInto(element, '#registration-form-url', 'https://forms.app/join');

    buttonNamed(element, 'حفظ التغييرات')?.click();
    await settle(fixture);

    expect(saves).toEqual([
      {
        title: 'انضم إلينا كمقدم خدمة',
        registrationFormUrl: 'https://forms.app/join',
        status: 'published',
      },
    ]);
    expect(element.querySelector('app-toast')?.textContent).toContain('تم حفظ التغييرات');
  });

  it('does not save an empty title or a broken link, and says why', async () => {
    const { fixture, element, saves } = render();
    typeInto(element, '#page-title', ' ');
    typeInto(element, '#registration-form-url', 'docs.google.com');

    buttonNamed(element, 'حفظ التغييرات')?.click();
    await settle(fixture);

    expect(saves).toEqual([]);
    expect(element.textContent).toContain('اكتب عنوان الصفحة');
    expect(element.textContent).toContain('أدخل رابطاً كاملاً يبدأ بـ https://');
  });

  it('shows why a save failed', async () => {
    const { fixture, element } = render({
      saveProviderJoinPage: (): Observable<never> => throwError(() => new Error('تعذر حفظ الصفحة')),
    });

    buttonNamed(element, 'حفظ التغييرات')?.click();
    await settle(fixture);

    expect(element.querySelector('app-toast')?.textContent).toContain('تعذر حفظ الصفحة');
  });

  it('draws a placeholder while the page loads, and a retry when it fails', () => {
    expect(
      render({ getProviderJoinPage: () => NEVER }).element.querySelector('app-skeleton'),
    ).toBeTruthy();

    TestBed.resetTestingModule();
    const { element } = render({
      getProviderJoinPage: () => throwError(() => new Error('تعذر تحميل الصفحة')),
    });
    expect(element.querySelector('app-error-state')?.textContent).toContain('تعذر تحميل الصفحة');
  });
});
