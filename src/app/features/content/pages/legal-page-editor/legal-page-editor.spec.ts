import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { ContentPageRepository } from '../../data/content-page.repository';
import { LegalPageKind } from '../../models/content-page-kind';
import { LegalPageDraft } from '../../models/legal-page-draft';
import { buildLegalPage } from '../../testing/content-fixture';
import { LegalPageEditor } from './legal-page-editor';

function render(kind: LegalPageKind, overrides: Partial<ContentPageRepository> = {}) {
  const saves: LegalPageDraft[] = [];
  const repository: Partial<ContentPageRepository> = {
    getLegalPage: () => of(buildLegalPage()),
    saveLegalPage: (_kind, draft) => {
      saves.push(draft);
      return of({ title: draft.title, body: draft.body });
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: ContentPageRepository, useValue: repository }],
  });
  const fixture = TestBed.createComponent(LegalPageEditor);
  fixture.componentRef.setInput('kind', kind);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, saves };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

async function settle(fixture: { whenStable(): Promise<unknown>; detectChanges(): void }) {
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('LegalPageEditor page', () => {
  it('names the page in the heading, under a breadcrumb back to the content list', () => {
    const { element } = render('terms');
    const crumb = element.querySelector('nav[aria-label="مسار الصفحة"]') as HTMLElement;

    expect(crumb.querySelector('a')?.getAttribute('href')).toBe('/content');
    expect(crumb.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('تعديل صفحة');
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('الشروط والأحكام');
    expect(element.textContent).toContain('تعديل المحتوى الذي يظهر للمستخدمين داخل تطبيق MapMob.');
  });

  it('names the privacy page too', () => {
    const { element } = render('privacy');

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('سياسة الخصوصية');
  });

  it('fills the title and the rich text from the saved page', () => {
    const { element } = render('terms');

    expect((element.querySelector('#page-title') as HTMLInputElement).value).toBe(
      'الشروط و الأحكام',
    );
    expect(element.querySelector('[contenteditable="true"]')?.innerHTML).toBe(
      '<p>مرحباً بك في MapMob.</p>',
    );
  });

  it('publishes the changes and confirms it', async () => {
    const { fixture, element, saves } = render('terms');
    const title = element.querySelector('#page-title') as HTMLInputElement;
    title.value = 'الشروط الجديدة';
    title.dispatchEvent(new Event('input'));

    buttonNamed(element, 'حفظ التغييرات').click();
    await settle(fixture);

    expect(saves).toEqual([
      { title: 'الشروط الجديدة', body: '<p>مرحباً بك في MapMob.</p>', status: 'published' },
    ]);
    expect(element.querySelector('app-toast')?.textContent).toContain('تم حفظ التغييرات');
  });

  it('saves a draft from the action bar', async () => {
    const { fixture, element, saves } = render('privacy');

    buttonNamed(element, 'حفظ كمسودة').click();
    await settle(fixture);

    expect(saves.map((draft) => draft.status)).toEqual(['draft']);
    expect(element.querySelector('app-toast')?.textContent).toContain('تم حفظ المسودة');
  });

  it('does not save an empty title, and says why', async () => {
    const { fixture, element, saves } = render('terms');
    const title = element.querySelector('#page-title') as HTMLInputElement;
    title.value = ' ';
    title.dispatchEvent(new Event('input'));

    buttonNamed(element, 'حفظ التغييرات').click();
    await settle(fixture);

    expect(saves).toEqual([]);
    expect(element.textContent).toContain('اكتب عنوان الصفحة');
  });

  it('shows why a save failed', async () => {
    const { fixture, element } = render('terms', {
      saveLegalPage: (): Observable<never> => throwError(() => new Error('تعذر حفظ الصفحة')),
    });

    buttonNamed(element, 'حفظ التغييرات').click();
    await settle(fixture);

    expect(element.querySelector('app-toast')?.textContent).toContain('تعذر حفظ الصفحة');
  });

  it('draws a placeholder while the page loads, and a retry when it fails', () => {
    expect(
      render('terms', { getLegalPage: () => NEVER }).element.querySelector('app-skeleton'),
    ).toBeTruthy();

    TestBed.resetTestingModule();
    const { element } = render('terms', {
      getLegalPage: () => throwError(() => new Error('تعذر تحميل الصفحة')),
    });
    expect(element.querySelector('app-error-state')?.textContent).toContain('تعذر تحميل الصفحة');
  });
});
