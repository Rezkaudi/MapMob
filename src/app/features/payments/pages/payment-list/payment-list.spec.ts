import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
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
    getPaymentFormOptions: () => of({ merchants: [], plans: [] }),
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

  it('opens the add dialog from the header button', async () => {
    const { fixture, element } = createPage();

    buttonNamed(
      element.querySelector('app-page-header') as HTMLElement,
      'إضافة دفعة جديدة',
    ).click();
    await settle(fixture);

    expect(element.querySelector('app-new-payment-dialog')).not.toBeNull();
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

  it('edits a payment from the row menu, then reloads the table and the cards', async () => {
    const updatePayment = vi.fn(() => of(DETAIL));
    const getSummary = vi.fn(() => of(SUMMARY));
    const { fixture, element } = createPage({ updatePayment, getSummary });

    pickFromFirstRowMenu(fixture, element, 'تعديل');
    const dialog = element.querySelector('app-edit-payment-dialog') as HTMLElement;
    expect(dialog.textContent).toContain('تعديل الدفعة');
    expect(element.querySelector('app-payment-detail-dialog')).toBeNull();

    buttonNamed(dialog, 'حفظ التعديلات').click();
    await settle(fixture);

    expect(updatePayment).toHaveBeenCalledWith(DETAIL.id, expect.objectContaining({ amount: 25 }));
    expect(element.querySelector('app-edit-payment-dialog')).toBeNull();
    expect(getSummary).toHaveBeenCalledTimes(2);
  });

  it('asks before deleting a payment, then deletes it', async () => {
    const deletePayment = vi.fn(() => of(undefined));
    const { fixture, element } = createPage({ deletePayment });

    pickFromFirstRowMenu(fixture, element, 'حذف');
    const confirm = element.querySelector('app-confirm-action-dialog') as HTMLElement;
    expect(confirm.textContent).toContain('حذف الدفعة');
    expect(confirm.textContent).toContain('#pay-1024');
    expect(deletePayment).not.toHaveBeenCalled();

    buttonNamed(confirm, 'حذف الدفعة').click();
    await settle(fixture);

    expect(deletePayment).toHaveBeenCalledWith(DETAIL.id);
    expect(element.querySelector('app-confirm-action-dialog')).toBeNull();
  });

  it('keeps the delete question open and says why when the delete fails', async () => {
    const { fixture, element } = createPage({
      deletePayment: () => throwError(() => new Error('تعذر حذف الدفعة')),
    });

    pickFromFirstRowMenu(fixture, element, 'حذف');
    buttonNamed(
      element.querySelector('app-confirm-action-dialog') as HTMLElement,
      'حذف الدفعة',
    ).click();
    await settle(fixture);

    expect(element.querySelector('app-confirm-action-dialog')).not.toBeNull();
    expect(element.querySelector('app-toast')?.textContent).toContain('تعذر حذف الدفعة');
  });
});

function pickFromFirstRowMenu(
  fixture: ReturnType<typeof createPage>['fixture'],
  element: HTMLElement,
  label: string,
): void {
  const menu = element.querySelector(
    'app-payment-table tbody tr app-row-actions-menu',
  ) as HTMLElement;
  (menu.querySelector('button') as HTMLButtonElement).click();
  fixture.detectChanges();
  buttonNamed(menu, label).click();
  fixture.detectChanges();
}
