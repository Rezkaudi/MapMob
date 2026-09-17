import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FormPageHeading } from './form-page-heading';

function render() {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(FormPageHeading);
  fixture.componentRef.setInput('parentLabel', 'العروض');
  fixture.componentRef.setInput('parentLink', '/offers');
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

    expect(crumb.querySelector('a')?.getAttribute('href')).toBe('/offers');
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
    fixture.componentRef.setInput('parentLink', '/complaints');
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
      parentLink="/content"
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
