import { TestBed } from '@angular/core/testing';
import { CrudDialogRequest } from '../../../../shared/state/crud-dialog-request';
import { DeliveryPlatformEntry } from '../../models/delivery-platform-entry';
import { buildDeliveryPlatform } from '../../testing/delivery-platform-fixture';
import { DeliveryPlatformDialogs } from './delivery-platform-dialogs';

const TALABAT = buildDeliveryPlatform({ logoUrl: 'https://cdn.test/t.png', sortOrder: 3 });

function render(request: CrudDialogRequest<DeliveryPlatformEntry> | null) {
  const fixture = TestBed.createComponent(DeliveryPlatformDialogs);
  fixture.componentRef.setInput('request', request);
  fixture.componentRef.setInput('suggestedSortOrder', 8);
  fixture.detectChanges();
  return fixture;
}

describe('DeliveryPlatformDialogs', () => {
  it('shows nothing without a request', () => {
    expect((render(null).nativeElement as HTMLElement).children).toHaveLength(0);
  });

  it('opens an empty add dialog', () => {
    const element = render({ type: 'form', mode: 'create', entry: null })
      .nativeElement as HTMLElement;

    expect(element.textContent).toContain('إضافة منصة طلبات جديدة');
    expect((element.querySelector('[data-testid="platform-name"]') as HTMLInputElement).value).toBe(
      '',
    );
  });

  it('opens the edit dialog on the saved platform', () => {
    const element = render({ type: 'form', mode: 'edit', entry: TALABAT })
      .nativeElement as HTMLElement;

    expect(
      (element.querySelector('[data-testid="platform-latin-name"]') as HTMLInputElement).value,
    ).toBe('talabat');
    expect(element.querySelector('app-platform-logo-field img')?.getAttribute('src')).toBe(
      'https://cdn.test/t.png',
    );
  });

  it('asks before switching a platform off', () => {
    const element = render({ type: 'confirm', action: 'suspend', entry: TALABAT })
      .nativeElement as HTMLElement;

    expect(element.textContent).toContain('هل أنت متأكد من تعطيل منصة طلبات؟');
  });
});
