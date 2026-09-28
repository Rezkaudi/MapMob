import { TestBed } from '@angular/core/testing';
import { ProductDialog } from './product-dialog';
import { ProductDraft } from '../../models/product-draft';

function build() {
  const fixture = TestBed.createComponent(ProductDialog);
  fixture.detectChanges();
  return fixture;
}

function typeInto(fixture: ReturnType<typeof build>, testId: string, value: string) {
  const field: HTMLInputElement = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  field.value = value;
  field.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}

describe('ProductDialog', () => {
  it('shows the heading, subtitle and every field label from the design', () => {
    const text = build().nativeElement.textContent;

    expect(text).toContain('إضافة منتج أو خدمة');
    expect(text).toContain('أضف بيانات المنتج أو الخدمة ليظهر ضمن صفحة المكان.');
    expect(text).toContain('الصورة');
    expect(text).toContain('اسم المنتج أو الخدمة');
    expect(text).toContain('السعر');
    expect(text).toContain('الحالة');
    expect(text).toContain('رابط الطلب');
    expect(text).toContain('يستخدم لنقل المستخدم إلى منصة أو تطبيق الطلب الخارجي.');
  });

  it('keeps the submit button disabled until a name and a price are given', () => {
    const fixture = build();
    const submit: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-testid="submit-product"]',
    );
    expect(submit.disabled).toBe(true);

    typeInto(fixture, 'product-name', 'تنظيف بشرة عميق');
    expect(submit.disabled).toBe(true);

    typeInto(fixture, 'product-price', '150');
    expect(submit.disabled).toBe(false);
  });

  it('emits the draft it collected', () => {
    const fixture = build();
    const drafts: ProductDraft[] = [];
    fixture.componentInstance.submitted.subscribe((draft) => drafts.push(draft));

    typeInto(fixture, 'product-name', 'سيروم تحت العين');
    typeInto(fixture, 'product-price', '200');
    typeInto(fixture, 'product-order-url', 'https://shop.example.com/serum');
    fixture.nativeElement.querySelector('[data-testid="submit-product"]').click();

    expect(drafts).toEqual([
      {
        name: 'سيروم تحت العين',
        price: 200,
        currency: 'SYP',
        isAvailable: true,
        imageUrl: '',
        imageFile: null,
        orderUrl: 'https://shop.example.com/serum',
      },
    ]);
  });

  it('starts on the Syrian pound and lets the admin price in dollars instead', () => {
    const fixture = build();
    const drafts: ProductDraft[] = [];
    fixture.componentInstance.submitted.subscribe((draft) => drafts.push(draft));

    const currency: HTMLSelectElement = fixture.nativeElement.querySelector(
      '[data-testid="currency-select"]',
    );
    expect(currency.value).toBe('SYP');

    typeInto(fixture, 'product-name', 'سيروم تحت العين');
    typeInto(fixture, 'product-price', '200');
    currency.value = 'USD';
    currency.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[data-testid="submit-product"]').click();

    expect(drafts[0].currency).toBe('USD');
  });

  it('cancels from both the footer button and the close icon', () => {
    const fixture = build();
    let cancels = 0;
    fixture.componentInstance.cancelled.subscribe(() => (cancels += 1));

    fixture.nativeElement.querySelector('[data-testid="cancel-product"]').click();
    fixture.nativeElement.querySelector('[data-testid="close-product-dialog"]').click();

    expect(cancels).toBe(2);
  });

  it('starts a new product as متاح and can mark it غير متاح instead', () => {
    const fixture = build();
    const drafts: ProductDraft[] = [];
    fixture.componentInstance.submitted.subscribe((draft) => drafts.push(draft));

    const status: HTMLSelectElement = fixture.nativeElement.querySelector(
      '[data-testid="product-status"]',
    );
    expect(status.value).toBe('available');
    expect([...status.options].map((option) => option.textContent?.trim())).toEqual([
      'متاح',
      'غير متاح',
    ]);

    typeInto(fixture, 'product-name', 'سيروم');
    typeInto(fixture, 'product-price', '200');
    status.value = 'unavailable';
    status.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[data-testid="submit-product"]').click();

    expect(drafts[0].isAvailable).toBe(false);
  });

  it('starts on the status the edited product already has', () => {
    const fixture = TestBed.createComponent(ProductDialog);
    fixture.componentRef.setInput('mode', 'edit');
    fixture.componentRef.setInput('initialDraft', {
      name: 'سيروم',
      price: 200,
      currency: 'SYP',
      isAvailable: false,
      imageUrl: '',
      imageFile: null,
      orderUrl: '',
    });
    fixture.detectChanges();

    const status: HTMLSelectElement = fixture.nativeElement.querySelector(
      '[data-testid="product-status"]',
    );
    expect(status.value).toBe('unavailable');
  });

  it('draws the dashed drop zone, reading "drag here" first and the browse link last', () => {
    const fixture = build();
    const prompt: HTMLElement = fixture.nativeElement.querySelector(
      'app-file-dropzone [data-role="prompt"]',
    );

    expect(prompt.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'اسحب وأفلت الصور هنا أو استعرض الملفات',
    );
  });

  it('sends the picked picture file with the draft, so it can be uploaded', () => {
    const fixture = build();
    const drafts: ProductDraft[] = [];
    fixture.componentInstance.submitted.subscribe((draft) => drafts.push(draft));
    const picture = new File(['x'], 'serum.png', { type: 'image/png' });

    const fileInput: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', { value: [picture] });
    fileInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    typeInto(fixture, 'product-name', 'سيروم');
    typeInto(fixture, 'product-price', '200');
    fixture.nativeElement.querySelector('[data-testid="submit-product"]').click();

    expect(drafts[0].imageFile).toBe(picture);
    expect(drafts[0].imageUrl).not.toBe('');
  });

  it('forgets the picked file once the picture is removed', () => {
    const fixture = build();
    const drafts: ProductDraft[] = [];
    fixture.componentInstance.submitted.subscribe((draft) => drafts.push(draft));
    const fileInput: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', { value: [new File(['x'], 'a.png')] });
    fileInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('[data-testid="remove-product-image"]').click();
    fixture.detectChanges();
    typeInto(fixture, 'product-name', 'سيروم');
    typeInto(fixture, 'product-price', '200');
    fixture.nativeElement.querySelector('[data-testid="submit-product"]').click();

    expect(drafts[0].imageFile).toBeNull();
    expect(drafts[0].imageUrl).toBe('');
  });

  it('can leave out the order link hint, as the merchant frame does', () => {
    const fixture = TestBed.createComponent(ProductDialog);
    fixture.componentRef.setInput('isOrderUrlHintVisible', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('يستخدم لنقل المستخدم');
  });

  it('draws the cancel button as tall as the submit button (44px)', () => {
    const cancel: HTMLElement = build().nativeElement.querySelector(
      '[data-testid="cancel-product"]',
    );

    expect(cancel.classList).toContain('h-11');
  });

  it('uses the compact 12/16 labels, the 4px footer margin and an 8px-inset currency chip', () => {
    const host: HTMLElement = build().nativeElement;

    const labels = [...host.querySelectorAll('app-field-label label')];
    expect(labels).toHaveLength(5);
    expect(labels.every((label) => label.classList.contains('text-[12px]/[16px]'))).toBe(true);
    expect(host.querySelector('footer')?.classList).toContain('mt-1');
    expect(host.querySelector('app-currency-select')?.classList).toContain('end-2');
  });

  it('writes the plus before the submit label, so RTL puts it on the right as the frame does', () => {
    const submit: HTMLElement = build().nativeElement.querySelector(
      '[data-testid="submit-product"]',
    );

    expect([...submit.children].map((child) => child.tagName.toLowerCase())).toEqual([
      'app-icon',
      'span',
    ]);
  });
});
