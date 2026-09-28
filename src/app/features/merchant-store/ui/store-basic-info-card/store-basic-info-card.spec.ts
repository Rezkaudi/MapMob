import { TestBed } from '@angular/core/testing';
import { NO_FIELD_ERRORS, buildFilledStoreForm } from '../../testing/store-form-fixture';
import { StoreBasicInfoCard } from './store-basic-info-card';

function render() {
  const form = buildFilledStoreForm();
  const fixture = TestBed.createComponent(StoreBasicInfoCard);
  fixture.componentRef.setInput('form', form);
  fixture.componentRef.setInput('coverImageUrl', 'assets/images/store-cover-pharmacy.jpg');
  fixture.componentRef.setInput('errors', { ...NO_FIELD_ERRORS, name: 'أدخل اسم المتجر' });
  fixture.componentRef.setInput('descriptionCounter', '300/39');
  fixture.detectChanges();
  return { fixture, form, element: fixture.nativeElement as HTMLElement };
}

describe('StoreBasicInfoCard', () => {
  it('heads the card and shows the cover', () => {
    const { element } = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('معلومات المتجر الأساسية');
    expect(element.querySelector('app-store-cover-picker img')?.getAttribute('src')).toBe(
      'assets/images/store-cover-pharmacy.jpg',
    );
  });

  it('binds the name and the description to the form', () => {
    const { element, form } = render();
    const name = element.querySelector('#store-name') as HTMLInputElement;
    const description = element.querySelector('#store-description') as HTMLTextAreaElement;

    expect(name.value).toBe('صيدلية الحياة');
    expect(description.value).toBe('صيدلية تقدم الأدوية والمستلزمات الطبية.');

    name.value = 'صيدلية الشفاء';
    name.dispatchEvent(new Event('input'));
    expect(form.controls.name.value).toBe('صيدلية الشفاء');
  });

  it('marks both fields required, counts the description and shows errors', () => {
    const { element } = render();
    const labels = [...element.querySelectorAll('app-store-field label')];

    expect(
      labels.map((label) => [...label.children].map((part) => part.textContent?.trim())),
    ).toEqual([
      ['اسم المتجر التجاري', '*'],
      ['وصف المتجر ونبذة التعريف', '*'],
    ]);
    expect(element.querySelector('[data-role="counter"]')?.textContent?.trim()).toBe('300/39');
    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe('أدخل اسم المتجر');
  });

  it('passes a picked cover on', () => {
    const { fixture, element } = render();
    const picked: File[] = [];
    fixture.componentInstance.coverPicked.subscribe((file) => picked.push(file));
    URL.createObjectURL = () => 'blob:cover';
    const file = new File(['x'], 'cover.jpg', { type: 'image/jpeg' });
    const input = element.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(input, 'files', { value: [file] });

    input.dispatchEvent(new Event('change'));

    expect(picked).toEqual([file]);
  });
});
