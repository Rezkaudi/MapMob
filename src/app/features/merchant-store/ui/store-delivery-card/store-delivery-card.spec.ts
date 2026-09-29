import { TestBed } from '@angular/core/testing';
import { ClipboardWriter } from '../../../../shared/browser/clipboard-writer';
import { toDeliveryLinkRows } from '../../state/delivery-link-rows';
import { buildFilledStoreForm } from '../../testing/store-form-fixture';
import { buildDeliveryLinks } from '../../testing/store-profile-fixture';
import { StoreDeliveryCard } from './store-delivery-card';

function render() {
  TestBed.configureTestingModule({
    providers: [{ provide: ClipboardWriter, useValue: { write: vi.fn() } }],
  });
  const form = buildFilledStoreForm();
  const fixture = TestBed.createComponent(StoreDeliveryCard);
  fixture.componentRef.setInput('form', form);
  fixture.componentRef.setInput(
    'rows',
    toDeliveryLinkRows(buildDeliveryLinks(), form.controls.deliveryLinks),
  );
  fixture.detectChanges();
  return { form, element: fixture.nativeElement as HTMLElement };
}

describe('StoreDeliveryCard', () => {
  it('titles the card and names its section after it', () => {
    const { element } = render();
    const heading = element.querySelector('h2');

    expect(heading?.textContent?.trim()).toBe('منصات الطلب والتوصيل');
    expect(element.querySelector('section')?.getAttribute('aria-labelledby')).toBe(heading?.id);
  });

  it('lists the platforms in the order the admins set', () => {
    const { element } = render();

    expect([...element.querySelectorAll('li h3')].map((name) => name.textContent)).toEqual([
      expect.stringContaining('بي أوردر'),
      expect.stringContaining('طلبات'),
    ]);
  });

  it('switches a platform in the form, which then needs its link', () => {
    const { element, form } = render();
    const talabatSwitch = element.querySelectorAll<HTMLButtonElement>('[role="switch"]')[1];

    talabatSwitch.click();

    const talabat = form.controls.deliveryLinks.at(1);
    expect(talabat.controls.isEnabled.value).toBe(true);
    expect(talabat.controls.storeUrl.hasError('required')).toBe(true);
    expect(form.dirty).toBe(true);
  });
});
