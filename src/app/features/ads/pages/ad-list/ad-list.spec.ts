import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { AdRepository } from '../../data/ad.repository';
import { buildAd } from '../../testing/ad-fixture';
import { AdList } from './ad-list';

function createPage(overrides: Partial<AdRepository> = {}) {
  const deleted: string[] = [];
  const savedFiles: string[] = [];
  const repository: Partial<AdRepository> = {
    getAds: () => of({ items: [buildAd(), buildAd({ id: 'ad-2' })], totalCount: 100 }),
    getSummary: () => of({ totalCount: 34, activeCount: 16, scheduledCount: 14, endedCount: 23 }),
    deleteAd: (id) => {
      deleted.push(id);
      return of(undefined) as Observable<void>;
    },
    exportAds: () => of(new Blob(['csv'])),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: AdRepository, useValue: repository },
      { provide: CLOCK, useValue: () => new Date(2026, 8, 15) },
      {
        provide: FileSaver,
        useValue: { save: (_file: Blob, name: string) => savedFiles.push(name) },
      },
    ],
  });
  const navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(AdList);
  fixture.detectChanges();
  return {
    fixture,
    element: fixture.nativeElement as HTMLElement,
    deleted,
    savedFiles,
    navigateByUrl,
  };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('AdList', () => {
  it('shows the header, the stat cards, the toolbar, the table and the paging', () => {
    const { element } = createPage();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('الإعلانات');
    expect(element.textContent).toContain(
      'إدارة الإعلانات المعروضة داخل التطبيق ومتابعة حالتها ومدة عرضها.',
    );
    expect(element.querySelector('app-add-button')?.textContent).toContain('إضافة إعلان جديد');
    expect(element.querySelector('app-export-button')).toBeTruthy();
    expect(element.querySelectorAll('app-stat-card')).toHaveLength(4);
    expect(element.querySelectorAll('app-ad-table tbody tr')).toHaveLength(2);
    expect(element.textContent).toContain('من 100 إعلان');
  });

  it('invites the first ad when there are none', () => {
    const { element, navigateByUrl } = createPage({
      getAds: () => of({ items: [], totalCount: 0 }),
    });

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('لا توجد إعلانات مضافة حتى الآن');
    buttonNamed(element, 'إضافة إعلان جديد').click();

    expect(navigateByUrl).toHaveBeenCalledWith('/ads/new');
  });

  it('opens the edit page of an ad and deletes one after confirming', async () => {
    const { fixture, element, deleted, navigateByUrl } = createPage();

    (element.querySelector('button[data-role="open-ad"]') as HTMLButtonElement).click();
    expect(navigateByUrl).toHaveBeenCalledWith('/ads/ad-1/edit');

    (element.querySelector('tbody tr app-row-actions-menu button') as HTMLButtonElement).click();
    fixture.detectChanges();
    buttonNamed(document, 'حذف').click();
    fixture.detectChanges();
    buttonNamed(
      element.querySelector('app-confirm-action-dialog') as HTMLElement,
      'حذف الإعلان',
    ).click();
    await fixture.whenStable();

    expect(deleted).toEqual(['ad-1']);
  });

  it('saves the export under a dated file name', async () => {
    const { fixture, element, savedFiles } = createPage();

    buttonNamed(element, 'تصدير').click();
    await fixture.whenStable();

    expect(savedFiles).toEqual(['ads-2026-09-15.csv']);
  });
});
