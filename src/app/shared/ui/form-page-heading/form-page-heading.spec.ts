import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FormPageHeading } from './form-page-heading';

function render() {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(FormPageHeading);
  fixture.componentRef.setInput('parentLabel', 'العروض');
  fixture.componentRef.setInput('parentLink', '/admin/offers');
  fixture.componentRef.setInput('title', 'إضافة عرض جديد');
  fixture.componentRef.setInput(
    'description',
    'أضف عرضاً جديداً ليظهر للمستخدمين ضمن العروض المتاحة.',
  );
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('FormPageHeading', () => {
  it('leads with a breadcrumb back to the list, then the title and description', () => {
    const element = render();
    const crumb = element.querySelector('nav[aria-label="مسار الصفحة"]') as HTMLElement;

    expect(crumb.querySelector('a')?.getAttribute('href')).toBe('/admin/offers');
    expect(crumb.querySelector('a')?.textContent?.trim()).toBe('العروض');
    expect(crumb.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe(
      'إضافة عرض جديد',
    );
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('إضافة عرض جديد');
    expect(element.textContent).toContain('أضف عرضاً جديداً ليظهر للمستخدمين ضمن العروض المتاحة.');
  });
});

describe('FormPageHeading without a description', () => {
  it('leaves the description line out, as the complaint detail page draws it', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(FormPageHeading);
    fixture.componentRef.setInput('parentLabel', 'البلاغات');
    fixture.componentRef.setInput('parentLink', '/admin/complaints');
    fixture.componentRef.setInput('title', 'تفاصيل البلاغ');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('تفاصيل البلاغ');
    expect(element.querySelector('p')).toBeNull();
  });
});

@Component({
  imports: [FormPageHeading],
  template: `
    <app-form-page-heading
      parentLabel="إدارة المحتوى"
      parentLink="/admin/content"
      currentLabel="تعديل صفحة"
      title="الأسئلة الشائعة"
      description="تعديل المحتوى الذي يظهر للمستخدمين داخل تطبيق MapMob."
      descriptionSize="small"
    >
      <button pageHeadingAction type="button">إضافة سؤال جديد</button>
    </app-form-page-heading>
  `,
})
class ContentHeadingHost {}

describe('FormPageHeading on a content page', () => {
  function renderHost(): HTMLElement {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ContentHeadingHost);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('names the current step apart from the title', () => {
    const element = renderHost();

    expect(element.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('تعديل صفحة');
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('الأسئلة الشائعة');
  });

  it('writes the description at 14px', () => {
    const description = renderHost().querySelector('h1 + p') as HTMLElement;

    expect(description.classList).toContain('text-[14px]/[20px]');
  });

  it('puts the page action beside the title block', () => {
    const element = renderHost();

    expect(element.querySelector('[data-role="heading-row"] > button')?.textContent).toBe(
      'إضافة سؤال جديد',
    );
  });
});

@Component({
  imports: [FormPageHeading],
  template: `
    <app-form-page-heading
      parentLabel="الشركات و المتاجر"
      parentLink="/admin/places"
      title="صيدلية الحياة"
      appearance="detail"
    >
      <p pageHeadingMeta data-role="meta">طرطوس شارع الثورة</p>
      <button pageHeadingAction type="button">تعديل المكان</button>
    </app-form-page-heading>
  `,
})
class DetailHeadingHost {}

describe('FormPageHeading on a detail page', () => {
  function renderDetail() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(DetailHeadingHost);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('sets the title at 24px in the primary text colour', () => {
    const title = renderDetail().querySelector('h1')!;

    expect(title.classList).toContain('text-[24px]/[29px]');
    expect(title.classList).toContain('text-text-primary');
  });

  it('puts the meta line right under the title', () => {
    const element = renderDetail();

    const titleBlock = element.querySelector('h1')!.parentElement!;
    expect(titleBlock.querySelector('[data-role="meta"]')?.textContent).toBe('طرطوس شارع الثورة');
  });

  it('lines the actions up with the top of the title', () => {
    const row = renderDetail().querySelector('[data-role="heading-row"]')!;

    expect(row.classList).toContain('items-start');
    expect(row.textContent).toContain('تعديل المكان');
  });

  it('keeps the form look by default: a 28px black title, centred actions', () => {
    const element = render();

    expect(element.querySelector('h1')!.classList).toContain('text-[28px]/[34px]');
    expect(element.querySelector('[data-role="heading-row"]')!.classList).toContain('items-center');
  });
});
