import { TestBed } from '@angular/core/testing';
import { DeliveryPlatformDraft } from '../../models/delivery-platform-draft';
import { buildDeliveryPlatformDraft } from '../../testing/delivery-platform-fixture';
import { DeliveryPlatformFormDialog } from './delivery-platform-form-dialog';

function render(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(DeliveryPlatformFormDialog);
  fixture.componentRef.setInput('mode', 'create');
  fixture.componentRef.setInput('initialDraft', null);
  fixture.componentRef.setInput('suggestedSortOrder', 8);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return fixture;
}

function field(fixture: ReturnType<typeof render>, testId: string) {
  return (fixture.nativeElement as HTMLElement).querySelector(`[data-testid="${testId}"]`) as
    HTMLInputElement | HTMLSelectElement;
}

function typeInto(fixture: ReturnType<typeof render>, testId: string, value: string): void {
  const input = field(fixture, testId);
  input.value = value;
  input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input'));
  fixture.detectChanges();
}

function labelsOf(element: HTMLElement): string[] {
  return Array.from(
    element.querySelectorAll('app-field-label label > span:first-child'),
    (label) => label.textContent?.trim() ?? '',
  );
}

function submit(fixture: ReturnType<typeof render>): void {
  (field(fixture, 'submit-platform') as unknown as HTMLButtonElement).click();
  fixture.detectChanges();
}

describe('DeliveryPlatformFormDialog', () => {
  it('lays the fields out right to left in the frame order', () => {
    const element = render().nativeElement as HTMLElement;

    expect(element.textContent).toContain('إضافة منصة طلبات جديدة');
    expect(labelsOf(element)).toEqual([
      'اسم المنصة بالعربي',
      'اسم المنصة بالانجليزية',
      'شعار المنصة(logo)',
      'رابط المنصة الرئيسي',
      'ترتيب الظهور في القوائم',
      'حالة المنصة الفورية',
    ]);
  });

  it('marks every field but the logo and the position as required', () => {
    const element = render().nativeElement as HTMLElement;

    const stars = Array.from(element.querySelectorAll('app-field-label'), (label) =>
      label.textContent?.includes('*'),
    );
    expect(stars).toEqual([true, true, false, true, false, true]);
    expect(element.textContent).toContain('(اختياري)');
  });

  it('shows the frame placeholders and suggests the next position', () => {
    const fixture = render();

    expect((field(fixture, 'platform-name') as HTMLInputElement).placeholder).toBe('مثال:طلبات');
    expect((field(fixture, 'platform-latin-name') as HTMLInputElement).placeholder).toBe(
      'مثال: talabat',
    );
    expect((field(fixture, 'platform-website') as HTMLInputElement).placeholder).toBe(
      'https://www.website.com',
    );
    expect((field(fixture, 'platform-sort-order') as HTMLInputElement).placeholder).toBe('8');
    expect(field(fixture, 'platform-status').value).toBe('active');
  });

  it('keeps the Latin web address left to right', () => {
    const website = field(render(), 'platform-website');

    expect(website.getAttribute('dir')).toBe('ltr');
  });

  it('explains what is missing instead of saving an empty form', () => {
    const fixture = render();
    const submitted: DeliveryPlatformDraft[] = [];
    fixture.componentInstance.submitted.subscribe((draft) => submitted.push(draft));

    submit(fixture);

    const alerts = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('[role="alert"]'),
      (alert) => alert.textContent?.trim(),
    );
    expect(alerts).toEqual([
      'أدخل اسم المنصة بالعربي',
      'أدخل اسم المنصة بالانجليزية',
      'أدخل رابط المنصة الرئيسي',
    ]);
    expect(submitted).toEqual([]);
  });

  it('sends the draft with the suggested position when none is typed', () => {
    const fixture = render();
    const submitted: DeliveryPlatformDraft[] = [];
    fixture.componentInstance.submitted.subscribe((draft) => submitted.push(draft));

    typeInto(fixture, 'platform-name', 'طلبات');
    typeInto(fixture, 'platform-latin-name', 'talabat');
    typeInto(fixture, 'platform-website', 'https://www.talabat.com');
    typeInto(fixture, 'platform-status', 'suspended');
    submit(fixture);

    expect(submitted).toEqual([
      {
        name: 'طلبات',
        latinName: 'talabat',
        websiteUrl: 'https://www.talabat.com',
        status: 'suspended',
        sortOrder: 8,
        logoFile: null,
        logoUrl: null,
      },
    ]);
  });

  it('opens an edit on the saved values and keeps the saved logo', () => {
    const saved = buildDeliveryPlatformDraft({ sortOrder: 3, logoUrl: 'https://cdn.test/t.png' });
    const fixture = render({ mode: 'edit', initialDraft: saved });
    const submitted: DeliveryPlatformDraft[] = [];
    fixture.componentInstance.submitted.subscribe((draft) => submitted.push(draft));

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('تعديل منصة الطلبات');
    expect(field(fixture, 'platform-sort-order').value).toBe('3');
    submit(fixture);

    expect(submitted).toEqual([saved]);
  });

  it('puts cancel on the right of the blue button and reports it', () => {
    const fixture = render();
    let cancelCount = 0;
    fixture.componentInstance.cancelled.subscribe(() => cancelCount++);
    const footer = (fixture.nativeElement as HTMLElement).querySelector('footer') as HTMLElement;

    const buttons = Array.from(footer.querySelectorAll('button'), (button) =>
      button.textContent?.trim(),
    );
    expect(buttons).toEqual(['إلغاء', 'إضافة منصة']);
    (footer.querySelector('button') as HTMLButtonElement).click();

    expect(cancelCount).toBe(1);
  });

  it('holds the save while one is running', () => {
    const fixture = render({ isBusy: true });

    expect((field(fixture, 'submit-platform') as unknown as HTMLButtonElement).disabled).toBe(true);
  });
});
