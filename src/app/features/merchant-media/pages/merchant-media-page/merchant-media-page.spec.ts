import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { MerchantMediaRepository } from '../../data/merchant-media.repository';
import { MediaDraft } from '../../models/media-draft';
import { MerchantMediaItem } from '../../models/merchant-media-item';
import { MerchantMediaLibrary } from '../../models/merchant-media-library';
import {
  buildMediaItem,
  buildMediaLibrary,
  buildMediaVideo,
} from '../../testing/merchant-media-fixture';
import { MerchantMediaPage } from './merchant-media-page';

class FakeRepository extends MerchantMediaRepository {
  library: MerchantMediaLibrary = buildMediaLibrary({
    items: [
      buildMediaItem({ id: 'main', isMain: true }),
      buildMediaVideo({ id: 'video' }),
      buildMediaItem({ id: 'picture' }),
    ],
  });
  isFailing = false;
  isPending = false;

  getLibrary(): Observable<MerchantMediaLibrary> {
    if (this.isPending) return NEVER;
    return this.isFailing ? throwError(() => new Error('انقطع الاتصال')) : of(this.library);
  }
  addMedia(draft: MediaDraft): Observable<MerchantMediaItem> {
    return of(buildMediaItem({ id: 'new', kind: draft.kind }));
  }
  replaceMedia(id: string): Observable<MerchantMediaItem> {
    return of(buildMediaItem({ id }));
  }
  deleteMedia(): Observable<void> {
    return of(undefined);
  }
}

function build(configure: (repository: FakeRepository) => void = () => undefined) {
  const repository = new FakeRepository();
  configure(repository);
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: MerchantMediaRepository, useValue: repository }],
  });
  const fixture = TestBed.createComponent(MerchantMediaPage);
  fixture.detectChanges();
  return fixture;
}

const hostOf = (fixture: ReturnType<typeof build>): HTMLElement => fixture.nativeElement;

describe('MerchantMediaPage', () => {
  it('shows the header, the usage card, the distribution card, the tabs and the grid', () => {
    const host = hostOf(build());

    expect(host.querySelector('h1')?.textContent?.trim()).toBe('الصور و الوسائط');
    expect(host.textContent).toContain(
      'إدارة الصور والوسائط الخاصة بمكانك و التي تظهر للمستخدمين على المنصة',
    );
    expect(host.querySelector('app-plan-usage-card')?.textContent).toContain('الوسائط المستخدمة');
    expect(host.querySelector('app-distribution-card')?.textContent).toContain(
      'الحد المسموح 5 وسائط',
    );
    expect(host.querySelectorAll('app-media-tabs [role="tab"]')).toHaveLength(3);
    expect(host.querySelectorAll('app-media-card')).toHaveLength(3);
    expect(host.querySelector('app-media-add-tile')).not.toBeNull();
  });

  it('puts the usage card on the right with 8 columns and the tiles on 4', () => {
    const grid = hostOf(build()).querySelector('[data-role="quota-grid"]')!;

    expect(grid.children[0].tagName).toBe('APP-PLAN-USAGE-CARD');
    expect(grid.children[0].className).toContain('xl:col-span-8');
    expect(grid.children[1].className).toContain('xl:col-span-4');
  });

  it('filters the grid by tab', () => {
    const fixture = build();

    (hostOf(fixture).querySelectorAll('[role="tab"]')[2] as HTMLElement).click();
    fixture.detectChanges();

    expect(hostOf(fixture).querySelectorAll('app-media-card')).toHaveLength(1);
  });

  it('opens the add dialog from the header button and from the dashed card', () => {
    const fixture = build();

    hostOf(fixture).querySelector<HTMLElement>('app-page-header app-add-button button')!.click();
    fixture.detectChanges();
    expect(hostOf(fixture).querySelector('app-media-add-dialog')).not.toBeNull();

    hostOf(fixture).querySelector<HTMLElement>('[data-testid="cancel-media"]')!.click();
    fixture.detectChanges();
    hostOf(fixture).querySelector<HTMLElement>('app-media-add-tile button')!.click();
    fixture.detectChanges();
    expect(hostOf(fixture).querySelector('app-media-add-dialog')).not.toBeNull();
  });

  it('shows the empty message under the tabs when the place has no media', () => {
    const host = hostOf(build((fake) => (fake.library = { ...fake.library, items: [] })));

    expect(host.querySelector('app-media-tabs')).not.toBeNull();
    expect(host.querySelector('app-media-card')).toBeNull();
    expect(host.querySelector('app-empty-page-message')?.textContent).toContain(
      'لا توجد وسائط مضافة حتى الآن',
    );
    expect(host.textContent).toContain(
      'أضف صورة أو فيديو جديد لمكانك لتظهر للمستخدمين في تطبيق MapMob.',
    );
  });

  it('turns off both add buttons once the plan is full', () => {
    const host = hostOf(
      build((fake) => (fake.library = { ...fake.library, imageLimit: 2, videoLimit: 1 })),
    );

    expect(
      host.querySelector<HTMLButtonElement>('app-page-header app-add-button button')!.disabled,
    ).toBe(true);
    expect(host.querySelector('app-media-add-tile')).toBeNull();
  });

  it('asks before deleting a card', () => {
    const fixture = build();

    hostOf(fixture).querySelector<HTMLElement>('app-media-card button[aria-haspopup]')!.click();
    fixture.detectChanges();
    const items = hostOf(fixture).querySelectorAll<HTMLElement>(
      '[data-testid="action-menu-panel"] button',
    );
    items[1].click();
    fixture.detectChanges();

    expect(hostOf(fixture).querySelector('app-confirm-action-dialog')?.textContent).toContain(
      'حذف الصورة',
    );
  });

  it('offers a retry when the gallery cannot load', () => {
    const host = hostOf(build((fake) => (fake.isFailing = true)));

    expect(host.querySelector('app-error-state')?.textContent).toContain('انقطع الاتصال');
    expect(host.querySelector('app-media-tabs')).toBeNull();
  });

  it('shows the skeleton while the gallery loads', () => {
    const host = hostOf(build((fake) => (fake.isPending = true)));

    expect(host.querySelector('h1')?.textContent?.trim()).toBe('الصور و الوسائط');
    expect(host.querySelector('app-merchant-media-skeleton')).not.toBeNull();
    expect(host.querySelector('app-media-tabs')).toBeNull();
  });

  it('hides the skeleton once the gallery has loaded', () => {
    const host = hostOf(build());

    expect(host.querySelector('app-merchant-media-skeleton')).toBeNull();
  });
});
