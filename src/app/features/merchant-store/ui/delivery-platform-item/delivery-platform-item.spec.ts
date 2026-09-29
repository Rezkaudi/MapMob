import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ClipboardWriter } from '../../../../shared/browser/clipboard-writer';
import { DeliveryLinkRow } from '../../models/delivery-link-row';
import { DeliveryPlatformItem } from './delivery-platform-item';

const BEE_ORDER_URL = 'https://beeorder.sy/store/alhayat-pharma';

function buildRow(overrides: Partial<DeliveryLinkRow> = {}): DeliveryLinkRow {
  return {
    index: 0,
    platform: { id: '1', name: 'بي أوردر', latinName: 'BeeOrder', logoUrl: null },
    isEnabled: true,
    storeUrl: BEE_ORDER_URL,
    canOpen: true,
    error: null,
    ...overrides,
  };
}

function render(row: DeliveryLinkRow = buildRow()) {
  const clipboard = { write: vi.fn(() => Promise.resolve()) };
  TestBed.configureTestingModule({
    providers: [{ provide: ClipboardWriter, useValue: clipboard }],
  });
  const fixture: ComponentFixture<DeliveryPlatformItem> =
    TestBed.createComponent(DeliveryPlatformItem);
  const urlControl = new FormControl(row.storeUrl, { nonNullable: true });
  fixture.componentRef.setInput('row', row);
  fixture.componentRef.setInput('urlControl', urlControl);
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  const find = <T extends Element>(selector: string) => element.querySelector(selector) as T;
  const enabledChanges: boolean[] = [];
  fixture.componentInstance.enabledChanged.subscribe((isOn) => enabledChanges.push(isOn));
  return { fixture, element, find, clipboard, enabledChanges };
}

describe('DeliveryPlatformItem', () => {
  it('draws the brand on the right, the Arabic name before the Latin one, the switch on the left', () => {
    const { find } = render();
    const header = find('[data-role="platform-header"]');

    expect([...header.children].map((child) => child.getAttribute('data-role'))).toEqual([
      'platform-brand',
      'platform-switch',
    ]);
    const brand = find('[data-role="platform-brand"]');
    expect(brand.firstElementChild?.getAttribute('data-role')).toBe('platform-logo');
    const names = [...find('h3').children].map((name) => name.textContent?.trim());
    expect(names).toEqual(['بي أوردر', '(BeeOrder)']);
    expect(find('h3').lastElementChild?.getAttribute('dir')).toBe('ltr');
  });

  it('shows the logo when the platform has one', () => {
    const { find } = render(
      buildRow({
        platform: { ...buildRow().platform, logoUrl: 'https://cdn.mapmob.sy/beeorder.png' },
      }),
    );

    expect(find<HTMLImageElement>('[data-role="platform-logo"] img').src).toBe(
      'https://cdn.mapmob.sy/beeorder.png',
    );
  });

  it('folds a switched-off platform down to its name and switch', () => {
    const { element, find, enabledChanges } = render(
      buildRow({ isEnabled: false, storeUrl: '', canOpen: false }),
    );

    expect(element.querySelector('input')).toBeNull();
    expect(element.querySelector('[data-role="platform-actions"]')).toBeNull();
    const toggle = find<HTMLButtonElement>('[role="switch"]');
    expect(toggle.getAttribute('aria-checked')).toBe('false');
    expect(toggle.getAttribute('aria-label')).toBe('تفعيل بي أوردر');

    toggle.click();
    expect(enabledChanges).toEqual([true]);
  });

  it('shows the saved link read-only, left to right', () => {
    const { find } = render();
    const input = find<HTMLInputElement>('input');

    expect(find('label').textContent?.trim()).toBe('رابط المتجر المباشر');
    expect(find('label').getAttribute('for')).toBe(input.id);
    expect(input.value).toBe(BEE_ORDER_URL);
    expect(input.readOnly).toBe(true);
    expect(input.getAttribute('dir')).toBe('ltr');
  });

  it('puts the copy button on the right of the link box', () => {
    const { find } = render();

    expect(find('[data-role="link-box"]').firstElementChild?.getAttribute('data-role')).toBe(
      'copy-link',
    );
  });

  it('copies the link and says so', async () => {
    const { fixture, find, clipboard } = render();
    const copy = find<HTMLButtonElement>('[data-role="copy-link"]');

    expect(copy.getAttribute('aria-label')).toBe('نسخ الرابط');
    copy.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(clipboard.write).toHaveBeenCalledWith(BEE_ORDER_URL);
    expect(copy.getAttribute('aria-label')).toBe('تم نسخ الرابط');
  });

  it('opens the store in a new tab from the right button, edits from the left one', () => {
    const { find } = render();
    const actions = find('[data-role="platform-actions"]');
    const open = find<HTMLAnchorElement>('[data-role="open-link"]');

    expect([...actions.children].map((child) => child.getAttribute('data-role'))).toEqual([
      'open-link',
      'edit-link',
    ]);
    expect(open.textContent?.trim()).toBe('فتح رابط المتجر');
    expect(open.href).toBe(BEE_ORDER_URL);
    expect(open.target).toBe('_blank');
    expect(open.rel).toBe('noopener noreferrer');
    expect(find('[data-role="edit-link"]').textContent?.trim()).toBe('تعديل الرابط');
  });

  it('cannot open or copy a link that is not ready', () => {
    const { find } = render(buildRow({ canOpen: false }));
    const open = find<HTMLAnchorElement>('[data-role="open-link"]');

    expect(open.hasAttribute('href')).toBe(false);
    expect(open.getAttribute('aria-disabled')).toBe('true');
    expect(find<HTMLButtonElement>('[data-role="copy-link"]').disabled).toBe(true);
  });

  it('lets the owner edit the link, and locks it again once they leave a valid one', () => {
    const { fixture, find } = render();
    const input = () => find<HTMLInputElement>('input');

    find<HTMLButtonElement>('[data-role="edit-link"]').click();
    fixture.detectChanges();

    expect(input().readOnly).toBe(false);
    expect(document.activeElement).toBe(input());

    input().dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(input().readOnly).toBe(true);
  });

  it('opens the link for typing when a platform without one is switched on', async () => {
    const { fixture, find } = render(buildRow({ isEnabled: false, storeUrl: '', canOpen: false }));

    find<HTMLButtonElement>('[role="switch"]').click();
    fixture.componentRef.setInput('row', buildRow({ storeUrl: '', canOpen: false }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(find<HTMLInputElement>('input').readOnly).toBe(false);
    expect(document.activeElement).toBe(find('input'));
  });

  it('keeps a wrong link open for fixing and shows why under it', () => {
    const { find } = render(buildRow({ error: 'أدخل رابط متجرك على المنصة', canOpen: false }));

    expect(find<HTMLInputElement>('input').readOnly).toBe(false);
    expect(find('[role="alert"]').textContent?.trim()).toBe('أدخل رابط متجرك على المنصة');
  });
});
