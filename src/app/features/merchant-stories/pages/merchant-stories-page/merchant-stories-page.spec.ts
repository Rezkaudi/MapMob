import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { MerchantStoriesRepository } from '../../data/merchant-stories.repository';
import { MerchantStory } from '../../models/merchant-story';
import { MerchantStoryLibrary } from '../../models/merchant-story-library';
import {
  STORY_NOW,
  buildExpiredStory,
  buildStory,
  buildStoryLibrary,
} from '../../testing/merchant-story-fixture';
import { MerchantStoriesPage } from './merchant-stories-page';

class FakeRepository extends MerchantStoriesRepository {
  library: MerchantStoryLibrary = buildStoryLibrary({
    items: [
      buildStory({ id: 'first' }),
      buildStory({ id: 'second' }),
      buildExpiredStory({ id: 'old' }),
    ],
  });
  isFailing = false;
  isPending = false;

  getLibrary(): Observable<MerchantStoryLibrary> {
    if (this.isPending) return NEVER;
    return this.isFailing ? throwError(() => new Error('انقطع الاتصال')) : of(this.library);
  }
  addStory(): Observable<MerchantStory> {
    return of(buildStory({ id: 'new' }));
  }
  updateStory(id: string): Observable<MerchantStory> {
    return of(buildStory({ id }));
  }
  deleteStory(): Observable<void> {
    return of(undefined);
  }
}

function build(configure: (repository: FakeRepository) => void = () => undefined) {
  const repository = new FakeRepository();
  configure(repository);
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: MerchantStoriesRepository, useValue: repository },
      { provide: CLOCK, useValue: () => STORY_NOW },
    ],
  });
  const fixture = TestBed.createComponent(MerchantStoriesPage);
  fixture.detectChanges();
  return fixture;
}

type Fixture = ReturnType<typeof build>;
const hostOf = (fixture: Fixture): HTMLElement => fixture.nativeElement;

function pickFromMenu(fixture: Fixture, cardSelector: string, itemIndex: number) {
  hostOf(fixture).querySelector<HTMLElement>(`${cardSelector} button[aria-haspopup]`)!.click();
  fixture.detectChanges();
  hostOf(fixture)
    .querySelectorAll<HTMLElement>('[data-testid="action-menu-panel"] button')
    [itemIndex].click();
  fixture.detectChanges();
}

describe('MerchantStoriesPage', () => {
  it('shows the header, the usage card, the distribution card and both lists', () => {
    const host = hostOf(build());

    expect(host.querySelector('h1')?.textContent?.trim()).toBe('القصص');
    expect(host.textContent).toContain(
      'شارك أخبار و عروض متجرك مع العملاء لمدة 24 ساعة لتعزيز المبيعات والمتابعة الفورية',
    );
    expect(host.querySelector('app-plan-usage-card')?.textContent).toContain('القصص المستخدمة');
    const tiles = host.querySelector('app-distribution-card')!;
    expect(tiles.textContent).toContain('توزيع القصص');
    expect(tiles.textContent).toContain('الحد المسموح 5 قصص');
    expect(host.querySelectorAll('app-active-story-card')).toHaveLength(2);
    expect(host.querySelectorAll('app-expired-story-card')).toHaveLength(1);
  });

  it('heads each list as the frame does', () => {
    const host = hostOf(build());
    const headings = [...host.querySelectorAll('h2[data-role="section-title"]')];

    expect(headings.map((heading) => heading.textContent?.trim())).toEqual([
      'القصص النشطة',
      'القصص المنتهية',
    ]);
    expect(host.textContent).toContain('تنتهي صلاحية كل قصة بعد 24 ساعة من نشرها');
  });

  it('puts the usage card on the right with 8 columns and the tiles on 4', () => {
    const grid = hostOf(build()).querySelector('[data-role="quota-grid"]')!;

    expect(grid.children[0].tagName).toBe('APP-PLAN-USAGE-CARD');
    expect(grid.children[0].className).toContain('xl:col-span-8');
    expect(grid.children[1].className).toContain('xl:col-span-4');
  });

  it('sets the plan pill 16px from the title, as this frame does', () => {
    const row = hostOf(build()).querySelector('app-plan-usage-card [data-role="heading-row"]');

    expect(row?.className).toContain('gap-4');
  });

  it('keeps the frame widths: 298.66px active cards 24px apart, 320px expired ones 32px apart', () => {
    const host = hostOf(build());
    const active = host.querySelector('[data-role="active-list"]')!;
    const expired = host.querySelector('[data-role="expired-list"]')!;

    expect(active.className).toContain('gap-6');
    expect(active.firstElementChild?.className).toContain('w-[298.66px]');
    expect(expired.className).toContain('gap-8');
    expect(expired.firstElementChild?.className).toContain('w-[320px]');
  });

  it('opens the add dialog from the header button', () => {
    const fixture = build();

    hostOf(fixture).querySelector<HTMLElement>('app-page-header app-add-button button')!.click();
    fixture.detectChanges();

    expect(hostOf(fixture).querySelector('app-story-form-dialog h2')?.textContent?.trim()).toBe(
      'إضافة قصة جديدة',
    );
  });

  it('turns the add button off once the plan is full', () => {
    const host = hostOf(build((fake) => (fake.library = { ...fake.library, activeStoryLimit: 2 })));

    expect(
      host.querySelector<HTMLButtonElement>('app-page-header app-add-button button')!.disabled,
    ).toBe(true);
  });

  it('opens the drawer, the edit dialog and the delete question from an active card', () => {
    const fixture = build();

    pickFromMenu(fixture, 'app-active-story-card', 0);
    expect(hostOf(fixture).querySelector('app-story-detail-drawer')).not.toBeNull();

    hostOf(fixture).querySelector<HTMLElement>('button[aria-label="إغلاق"]')!.click();
    fixture.detectChanges();
    pickFromMenu(fixture, 'app-active-story-card', 1);
    expect(hostOf(fixture).querySelector('app-story-form-dialog h2')?.textContent?.trim()).toBe(
      'تعديل القصة',
    );

    hostOf(fixture).querySelector<HTMLElement>('[data-testid="cancel-story"]')!.click();
    fixture.detectChanges();
    pickFromMenu(fixture, 'app-active-story-card', 2);
    expect(hostOf(fixture).querySelector('app-confirm-action-dialog')?.textContent).toContain(
      'صيدلية الشفاء • قصة اليوم',
    );
  });

  it('goes from the drawer to the delete question', () => {
    const fixture = build();
    pickFromMenu(fixture, 'app-expired-story-card', 0);

    hostOf(fixture).querySelector<HTMLElement>('app-story-detail-drawer footer button')!.click();
    fixture.detectChanges();

    expect(hostOf(fixture).querySelector('app-story-detail-drawer')).toBeNull();
    expect(hostOf(fixture).querySelector('app-confirm-action-dialog h2')?.textContent?.trim()).toBe(
      'حذف القصة',
    );
  });

  it('shows the empty message when the place never posted a story', () => {
    const host = hostOf(build((fake) => (fake.library = { ...fake.library, items: [] })));

    expect(host.querySelector('app-plan-usage-card')).not.toBeNull();
    expect(host.querySelector('[data-role="section-title"]')).toBeNull();
    expect(host.querySelector('app-empty-page-message')?.textContent).toContain(
      'لا توجد قصص حتى الآن',
    );
  });

  it('says so when no story is active, and hides the expired list when there is none', () => {
    const onlyExpired = hostOf(
      build((fake) => (fake.library = { ...fake.library, items: [buildExpiredStory()] })),
    );
    expect(onlyExpired.querySelector('[data-role="no-active"]')?.textContent).toContain(
      'لا توجد قصص نشطة حالياً',
    );

    TestBed.resetTestingModule();
    const onlyActive = hostOf(
      build((fake) => (fake.library = { ...fake.library, items: [buildStory()] })),
    );
    expect(onlyActive.querySelector('[data-role="expired-list"]')).toBeNull();
    expect(onlyActive.querySelectorAll('[data-role="section-title"]')).toHaveLength(1);
  });

  it('offers a retry when the stories cannot load', () => {
    const host = hostOf(build((fake) => (fake.isFailing = true)));

    expect(host.querySelector('app-error-state')?.textContent).toContain('انقطع الاتصال');
    expect(host.querySelector('app-plan-usage-card')).toBeNull();
  });

  it('shows the skeleton while the stories load, and hides it after', () => {
    const pending = hostOf(build((fake) => (fake.isPending = true)));
    expect(pending.querySelector('h1')?.textContent?.trim()).toBe('القصص');
    expect(pending.querySelector('app-merchant-stories-skeleton')).not.toBeNull();

    TestBed.resetTestingModule();
    expect(hostOf(build()).querySelector('app-merchant-stories-skeleton')).toBeNull();
  });

  it('opens the drawer when an active or an expired story is clicked', () => {
    const fixture = build();
    const open = (card: string) => {
      hostOf(fixture).querySelector<HTMLElement>(`${card} [data-role="open-story"]`)!.click();
      fixture.detectChanges();
      return hostOf(fixture).querySelector('app-story-detail-drawer');
    };

    expect(open('app-active-story-card')?.textContent).toContain('نشطة');

    hostOf(fixture).querySelector<HTMLElement>('button[aria-label="إغلاق"]')!.click();
    fixture.detectChanges();
    expect(open('app-expired-story-card')?.textContent).toContain('منتهية');
  });
});
