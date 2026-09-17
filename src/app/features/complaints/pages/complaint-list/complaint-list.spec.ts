import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { ComplaintRepository } from '../../data/complaint.repository';
import { buildComplaintDetail } from '../../testing/complaint-fixture';
import { ComplaintList } from './complaint-list';

const SUMMARY = {
  totalCount: 248,
  newCount: 32,
  inReviewCount: 10,
  resolvedCount: 20,
  rejectedCount: 10,
};

function createPage(overrides: Partial<ComplaintRepository> = {}) {
  const deletedIds: string[] = [];
  const repository: Partial<ComplaintRepository> = {
    getComplaints: () =>
      of({
        items: [buildComplaintDetail(), buildComplaintDetail({ id: 'complaint-2' })],
        totalCount: 3000,
      }),
    getSummary: () => of(SUMMARY),
    deleteComplaint: (id) => {
      deletedIds.push(id);
      return of(undefined);
    },
    exportComplaints: () => of(new Blob(['csv'])),
    ...overrides,
  };
  const savedFiles: string[] = [];
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: ComplaintRepository, useValue: repository },
      { provide: CLOCK, useValue: () => new Date(2026, 8, 17) },
      {
        provide: FileSaver,
        useValue: { save: (_file: Blob, name: string) => savedFiles.push(name) },
      },
    ],
  });
  const navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(ComplaintList);
  fixture.detectChanges();
  return {
    fixture,
    element: fixture.nativeElement as HTMLElement,
    savedFiles,
    deletedIds,
    navigateByUrl,
  };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('ComplaintList page', () => {
  it('shows the header with export, five stat cards, the toolbar, table and paging', () => {
    const { element } = createPage();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('البلاغات');
    expect(element.textContent).toContain(
      'متابعة وإدارة البلاغات المقدمة من المستخدمين على الأماكن والمحتوى.',
    );
    expect(buttonNamed(element, 'تصدير')).toBeTruthy();
    expect(element.querySelectorAll('app-stat-card')).toHaveLength(5);
    expect(element.querySelectorAll('[data-role="dot"]')).toHaveLength(4);
    expect(element.querySelector('app-complaint-toolbar')).toBeTruthy();
    expect(element.querySelectorAll('app-complaint-table tbody tr')).toHaveLength(2);
    expect(element.textContent).toContain('عرض 1- 4 من 3000 بلاغ');
  });

  it('opens the detail page from a row', () => {
    const { element, navigateByUrl } = createPage();

    (element.querySelector('app-complaint-table tbody tr') as HTMLElement).click();

    expect(navigateByUrl).toHaveBeenCalledWith('/complaints/complaint-1');
  });

  it('swaps everything under the title for the message when nothing was reported', () => {
    const { element } = createPage({ getComplaints: () => of({ items: [], totalCount: 0 }) });

    expect(element.querySelector('app-empty-page-message h2')?.textContent?.trim()).toBe(
      'لا توجد بلاغات حتى الآن',
    );
    expect(element.querySelector('app-complaint-table')).toBeNull();
    expect(element.querySelector('app-stat-card')).toBeNull();
    expect(buttonNamed(element, 'تصدير')).toBeUndefined();
  });

  it('saves the export under a dated name', async () => {
    const { fixture, element, savedFiles } = createPage();

    buttonNamed(element, 'تصدير').click();
    await fixture.whenStable();

    expect(savedFiles).toEqual(['complaints-2026-09-17.csv']);
  });

  it('asks before deleting, then deletes the complaint', async () => {
    const { fixture, element, deletedIds } = createPage();
    (element.querySelector('app-complaint-table button[aria-haspopup]') as HTMLElement).click();
    fixture.detectChanges();
    buttonNamed(element, 'حذف').click();
    fixture.detectChanges();

    const dialog = element.querySelector('app-confirm-action-dialog') as HTMLElement;
    expect(dialog.textContent).toContain('هل أنت متأكد من حذف البلاغ #1023؟');
    buttonNamed(dialog, 'حذف البلاغ').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(deletedIds).toEqual(['complaint-1']);
    expect(element.querySelector('app-confirm-action-dialog')).toBeNull();
  });
});
