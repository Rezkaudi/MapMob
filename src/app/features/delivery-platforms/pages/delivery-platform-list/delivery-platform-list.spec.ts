import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { DeliveryPlatformRepository } from '../../data/delivery-platform.repository';
import {
  buildDeliveryPlatform,
  buildDeliveryPlatformSummary,
  buildLinkedStore,
} from '../../testing/delivery-platform-fixture';
import { DeliveryPlatformList } from './delivery-platform-list';

const TALABAT = buildDeliveryPlatform();

function render(overrides: Partial<DeliveryPlatformRepository> = {}) {
  URL.createObjectURL = () => 'blob:logo';
  const repository: Partial<DeliveryPlatformRepository> = {
    getPlatforms: () => of({ items: [TALABAT], totalCount: 1 }),
    getSummary: () => of(buildDeliveryPlatformSummary()),
    getLinkedStores: () => of([buildLinkedStore()]),
    createPlatform: vi.fn(() => of(TALABAT)),
    setPlatformStatus: vi.fn(() => of(TALABAT)),
    deletePlatform: vi.fn((): Observable<void> => of(undefined)),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [{ provide: DeliveryPlatformRepository, useValue: repository }],
  });
  const fixture = TestBed.createComponent(DeliveryPlatformList);
  fixture.detectChanges();
  return { fixture, repository, element: fixture.nativeElement as HTMLElement };
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement | undefined {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  );
}

function openRowMenuItem(fixture: ReturnType<typeof render>['fixture'], label: string): void {
  const element = fixture.nativeElement as HTMLElement;
  (element.querySelector('tbody button[aria-haspopup]') as HTMLButtonElement).click();
  fixture.detectChanges();
  buttonNamed(element, label)?.click();
  fixture.detectChanges();
}

describe('DeliveryPlatformList', () => {
  it('shows the header, the four cards, the toolbar, the rows and the page range', () => {
    const { element } = render();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('منصات الطلبات و التوصيل');
    expect(element.textContent).toContain('إدارة منصات الطلبات والتوصيل المتاحة .');
    expect(buttonNamed(element, 'إضافة منصة توصيل')).toBeTruthy();
    expect(element.querySelectorAll('app-stat-card')).toHaveLength(4);
    expect(element.querySelector('app-delivery-platform-toolbar')).not.toBeNull();
    expect(element.querySelector('tbody')?.textContent).toContain('talabat');
    expect(element.textContent).toContain('عرض 1- 1 من 1 منصة');
  });

  it('keeps the frame order: header, cards, toolbar, table, paging', () => {
    const { element } = render();

    const blocks = [...(element.firstElementChild?.parentElement?.children ?? [])]
      .map((child) => child.tagName.toLowerCase())
      .filter((tag) => tag.startsWith('app-'));
    expect(blocks.slice(0, 5)).toEqual([
      'app-page-header',
      'app-delivery-platform-stat-cards',
      'app-delivery-platform-toolbar',
      'app-delivery-platform-table',
      'app-table-pagination',
    ]);
  });

  it('opens the add dialog with the next display position suggested', () => {
    const { fixture, element } = render();

    buttonNamed(element, 'إضافة منصة توصيل')?.click();
    fixture.detectChanges();

    expect(element.textContent).toContain('إضافة منصة طلبات جديدة');
    expect(
      (element.querySelector('[data-testid="platform-sort-order"]') as HTMLInputElement)
        .placeholder,
    ).toBe('8');
  });

  it('opens the linked stores of a row from its menu and closes them again', () => {
    const { fixture, element } = render();

    openRowMenuItem(fixture, 'عرض المتاجر المرتبطة');

    expect(element.querySelector('app-linked-stores-dialog h2')?.textContent?.trim()).toBe(
      'المتاجر المرتبطة بمنصة طلبات',
    );
    expect(element.querySelector('app-linked-stores-dialog tbody')?.textContent).toContain(
      'مطعم المدينة',
    );
    (
      element.querySelector('app-linked-stores-dialog [data-role="close-dialog"]') as HTMLElement
    ).click();
    fixture.detectChanges();

    expect(element.querySelector('app-linked-stores-dialog')).toBeNull();
  });

  it('opens the linked stores when the platform name is clicked', () => {
    const { fixture, element } = render();

    (element.querySelector('tbody [data-role="open-platform"]') as HTMLElement).click();
    fixture.detectChanges();

    expect(element.querySelector('app-linked-stores-dialog h2')?.textContent?.trim()).toBe(
      'المتاجر المرتبطة بمنصة طلبات',
    );
  });

  it('switches a platform off after asking', async () => {
    const { fixture, element, repository } = render();

    openRowMenuItem(fixture, 'تغيير الحالة');
    buttonNamed(element, 'تعطيل المنصة')?.click();
    await fixture.whenStable();

    expect(repository.setPlatformStatus).toHaveBeenCalledWith('platform-1', 'suspended');
  });
});
