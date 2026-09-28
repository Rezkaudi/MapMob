import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createOfferFieldsFormGroup } from '../../forms/offer-form-controls';
import { OfferItem } from '../../models/offer-item';
import { UploadedImage } from '../image-upload-field/uploaded-image';
import { OfferFormFields } from './offer-form-fields';

const ITEMS: readonly OfferItem[] = [
  { id: 'product-1', name: 'شامبو 1', price: 200, currency: 'SYP' },
  { id: 'product-2', name: 'بلسم', price: 150, currency: 'SYP' },
];

@Component({
  imports: [OfferFormFields],
  template: `
    <app-offer-form-fields
      [form]="form"
      [items]="items"
      [image]="image()"
      (imageChange)="image.set($event)"
    >
      <p data-testid="extra-row">حقول إضافية</p>
    </app-offer-form-fields>
  `,
})
class HostComponent {
  readonly form = createOfferFieldsFormGroup();
  readonly items = ITEMS;
  readonly image = signal<UploadedImage | null>(null);
}

function render() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  return { fixture, element, form: fixture.componentInstance.form };
}

function labels(element: HTMLElement): string[] {
  return [...element.querySelectorAll('app-form-field > div > div:first-child label')].map(
    (label) => label.firstChild?.textContent?.trim() ?? '',
  );
}

describe('OfferFormFields', () => {
  it('lays the fields out in the frame order, the projected row after the first pair', () => {
    const { element } = render();
    const grid = element.querySelector('[data-role="offer-fields"]') as HTMLElement;

    expect(labels(element)).toEqual([
      'اسم العرض',
      'قيمة الخصم',
      'مدة العرض',
      'حالة العرض',
      'وصف العرض',
      'نطاق العرض',
      'صورة العرض',
    ]);
    expect([...grid.children].map((child) => child.tagName.toLowerCase()).slice(0, 3)).toEqual([
      'app-form-field',
      'app-form-field',
      'p',
    ]);
  });

  it('writes what is typed and picked into the form', () => {
    const { fixture, element, form } = render();
    const title = element.querySelector('#offer-title') as HTMLInputElement;
    title.value = 'خصم الشتاء';
    title.dispatchEvent(new Event('input'));
    const status = element.querySelector('#offer-status') as HTMLSelectElement;
    status.value = 'paused';
    status.dispatchEvent(new Event('change'));
    const from = element.querySelector('input[aria-label="تاريخ بداية العرض"]') as HTMLInputElement;
    from.value = '2026-09-01';
    from.dispatchEvent(new Event('change'));
    (element.querySelectorAll('app-offer-scope-picker [role="radio"]')[1] as HTMLElement).click();
    fixture.detectChanges();
    (element.querySelector('app-offer-item-picker li input') as HTMLInputElement).click();

    expect(form.getRawValue()).toMatchObject({
      title: 'خصم الشتاء',
      status: 'paused',
      startsOn: '2026-09-01',
      scope: 'selectedItems',
      itemIds: ['product-1'],
    });
  });

  it('shows what is missing once the form is marked touched from outside', () => {
    const { fixture, element, form } = render();

    form.markAllAsTouched();
    fixture.detectChanges();

    expect(element.textContent).toContain('اكتب اسم العرض');
    expect(element.textContent).toContain('اختر تاريخ بداية العرض وتاريخ انتهائه');
  });

  it('shows a value put in by the page, as when an offer opens for editing', () => {
    const { fixture, element, form } = render();

    form.patchValue({ title: 'خصم الخريف', endsOn: '2026-10-01' });
    fixture.detectChanges();

    expect((element.querySelector('#offer-title') as HTMLInputElement).value).toBe('خصم الخريف');
    expect(
      (element.querySelector('input[aria-label="تاريخ انتهاء العرض"]') as HTMLInputElement).value,
    ).toBe('2026-10-01');
  });
});
