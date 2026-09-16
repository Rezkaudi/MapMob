import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { PaymentRepository } from '../../data/payment.repository';
import { buildPaymentDetail } from '../../testing/payment-fixture';
import { PaymentList } from './payment-list';

const DETAIL = buildPaymentDetail();
const SUMMARY = { pendingCount: 20, transactionCount: 400, monthTotal: 200, cumulativeTotal: 1200 };

function createPage(overrides: Partial<PaymentRepository> = {}) {
  const repository: Partial<PaymentRepository> = {
    getPayments: () =>
      of({
        items: [buildPaymentDetail(), buildPaymentDetail({ id: 'payment-2' })],
        totalCount: 3000,
      }),
    getSummary: () => of(SUMMARY),
    getPaymentDetail: () => of(DETAIL),
    exportPayments: () => of(new Blob(['csv'])),
    ...overrides,
  };
  const savedFiles: string[] = [];
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: PaymentRepository, useValue: repository },
      { provide: CLOCK, useValue: () => new Date(2026, 8, 15) },
      {
        provide: FileSaver,
        useValue: { save: (_file: Blob, name: string) => savedFiles.push(name) },
      },
    ],
  });
  const navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(PaymentList);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, savedFiles, navigateByUrl };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

async function settle(fixture: ReturnType<typeof createPage>['fixture']): Promise<void> {
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('PaymentList', () => {
  it('shows the header, the stat cards, the toolbar, the table and the paging', () => {
    const { element } = createPage();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('المدفوعات');
    expect(element.textContent).toContain('تسجيل ومتابعة مدفوعات الشركات والمتاجر.');
    expect(element.querySelector('app-page-header app-add-button')?.textContent).toContain(
      'إضافة دفعة جديدة',
    );
    expect(element.querySelector('app-page-header app-export-button')).toBeTruthy();
    expect(
      Array.from(element.querySelectorAll('app-stat-card'), (card) =>
        card.querySelector('[data-role="value"]')?.textContent?.trim(),
      ),
    ).toEqual(['$1200', '200$', '400', '20']);
    expect(element.querySelector('app-payment-toolbar')).toBeTruthy();
    expect(element.querySelectorAll('app-payment-table tbody tr')).toHaveLength(2);
    expect(element.textContent).toContain('من 3000 عملية دفع');
  });

  it('shows only the header and the empty message when there are no payments', () => {
    const { element } = createPage({ getPayments: () => of({ items: [], totalCount: 0 }) });

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('لا توجد مدفوعات لعرضها');
    expect(element.querySelector('app-payment-table')).toBeNull();
  });

  it('goes to the add page from the header button', () => {
    const { element, navigateByUrl } = createPage();

    buttonNamed(element.querySelector('app-page-header') as HTMLElement, 'إضافة دفعة جديدة').click();

    expect(navigateByUrl).toHaveBeenCalledWith('/payments/new');
  });

  it('saves the export under a dated file name', async () => {
    const { fixture, element, savedFiles } = createPage();

    buttonNamed(element, 'تصدير').click();
    await settle(fixture);

    expect(savedFiles).toEqual(['payments-2026-09-15.csv']);
  });

  it('opens the payment detail dialog from a row, and closes it from the cross', () => {
    const { fixture, element } = createPage();

    (element.querySelector('app-payment-table tbody tr') as HTMLElement).click();
    fixture.detectChanges();
    const dialog = element.querySelector('app-payment-detail-dialog') as HTMLElement;
    expect(dialog.textContent).toContain('صيدلية الحياة');

    (dialog.querySelector('button[aria-label="إغلاق النافذة"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(element.querySelector('app-payment-detail-dialog')).toBeNull();
  });
});
