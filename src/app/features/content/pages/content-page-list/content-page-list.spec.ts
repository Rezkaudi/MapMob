import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ContentPageRepository } from '../../data/content-page.repository';
import { buildContentPage } from '../../testing/content-fixture';
import { ContentPageList } from './content-page-list';

function render(overrides: Partial<ContentPageRepository> = {}) {
  const repository: Partial<ContentPageRepository> = {
    getPages: () =>
      of([buildContentPage(), buildContentPage({ kind: 'contact', title: 'تواصل معنا' })]),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: ContentPageRepository, useValue: repository }],
  });
  const fixture = TestBed.createComponent(ContentPageList);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('ContentPageList page', () => {
  it('leads with the section title and its description', () => {
    const { element } = render();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe(
      'إدارة المحتوى والصفحات التعريفية',
    );
    expect(element.textContent).toContain('إدارة نصوص و صفحات التطبيق الثابتة.');
  });

  it('lists the pages, and narrows them by the search box', () => {
    const { fixture, element } = render();
    expect(element.querySelectorAll('tbody tr')).toHaveLength(2);

    const search = element.querySelector('input[type="search"]') as HTMLInputElement;
    expect(search.placeholder).toBe('ابحث عن صفحة بالاسم....');
    search.value = 'تواصل';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(element.querySelectorAll('tbody tr')).toHaveLength(1);
  });

  it('offers a retry when the pages cannot be loaded', () => {
    const { element } = render({
      getPages: () => throwError(() => new Error('تعذر تحميل الصفحات')),
    });

    expect(element.querySelector('app-error-state')?.textContent).toContain('تعذر تحميل الصفحات');
  });
});
