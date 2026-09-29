import { TestBed } from '@angular/core/testing';
import { ClipboardWriter } from '../../../../../shared/browser/clipboard-writer';
import { DeliveryLink } from '../../../../../shared/models/delivery-link';
import { DeliveryLinkPreview } from './delivery-link-preview';

const BEE_ORDER_LINK: DeliveryLink = {
  platform: { id: '1', name: 'بي أوردر', latinName: 'BeeOrder', logoUrl: null },
  isEnabled: true,
  storeUrl: 'https://beeorder.sy/store/alhayat-pharma',
};

function render(link: DeliveryLink = BEE_ORDER_LINK) {
  const write = vi.fn().mockResolvedValue(undefined);
  TestBed.configureTestingModule({
    providers: [{ provide: ClipboardWriter, useValue: { write } }],
  });
  const fixture = TestBed.createComponent(DeliveryLinkPreview);
  fixture.componentRef.setInput('link', link);
  fixture.detectChanges();
  const element: HTMLElement = fixture.nativeElement;
  const find = (role: string) => element.querySelector<HTMLElement>(`[data-role="${role}"]`);
  return { fixture, write, find };
}

describe('DeliveryLinkPreview', () => {
  it('names the platform both ways, the Latin name in brackets', () => {
    const { find } = render();

    expect(find('platform-name')?.textContent?.trim()).toBe('بي أوردر');
    expect(find('platform-latin-name')?.textContent?.trim()).toBe('(BeeOrder)');
  });

  it('shows the store link left to right', () => {
    const { find } = render();

    const link = find('store-url');
    expect(link?.textContent?.trim()).toBe('https://beeorder.sy/store/alhayat-pharma');
    expect(link?.getAttribute('dir')).toBe('ltr');
  });

  it('opens the store link in a new tab', () => {
    const { find } = render();

    const openLink = find('open-link');
    expect(openLink?.getAttribute('href')).toBe('https://beeorder.sy/store/alhayat-pharma');
    expect(openLink?.getAttribute('target')).toBe('_blank');
    expect(openLink?.textContent?.trim()).toBe('فتح رابط المتجر');
  });

  it('copies the link and says so', async () => {
    const { fixture, write, find } = render();

    find('copy-link')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(write).toHaveBeenCalledWith('https://beeorder.sy/store/alhayat-pharma');
    expect(find('copy-link')?.textContent?.trim()).toBe('تم النسخ');
  });

  it('draws the logo when the platform has one', () => {
    const { find } = render({
      ...BEE_ORDER_LINK,
      platform: { ...BEE_ORDER_LINK.platform, logoUrl: 'https://cdn.mapmob.sy/beeorder.png' },
    });

    expect(find('platform-logo')?.querySelector('img')?.getAttribute('src')).toBe(
      'https://cdn.mapmob.sy/beeorder.png',
    );
  });

  it('puts the open button on the right and the copy button on the left', () => {
    const { find } = render();

    const actions = [...(find('platform-actions')?.children ?? [])];
    expect(actions.map((action) => action.getAttribute('data-role'))).toEqual([
      'open-link',
      'copy-link',
    ]);
  });
});
