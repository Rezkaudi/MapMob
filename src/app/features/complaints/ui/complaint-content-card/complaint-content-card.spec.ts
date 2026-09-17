import { TestBed } from '@angular/core/testing';
import { buildComplaintDetailView } from '../../state/complaint-detail-view';
import { buildComplaintDetail } from '../../testing/complaint-fixture';
import { ComplaintContentCard } from './complaint-content-card';

function render(
  attachmentUrls: readonly string[] = ['assets/images/complaint-closed-storefront.jpg'],
) {
  const detail = buildComplaintDetail({ attachmentUrls });
  const fixture = TestBed.createComponent(ComplaintContentCard);
  fixture.componentRef.setInput('detail', detail);
  fixture.componentRef.setInput('view', buildComplaintDetailView(detail));
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('ComplaintContentCard', () => {
  it('shows the heading, the reason box and the extra details', () => {
    const element = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('بيانات البلاغ وسبب التبليغ');
    expect(element.textContent).toContain('وصف البلاغ');
    expect(element.textContent).toContain('معلومات المكان غير صحيحة');
    expect(element.textContent).toContain('تفاصيل إضافية من المستخدم:');
    expect(element.textContent).toContain('ذهبت إلى الموقع مرتين متتاليتين');
  });

  it('links each attachment to the full picture in a new tab', () => {
    const link = render().querySelector('a[data-role="attachment"]') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('assets/images/complaint-closed-storefront.jpg');
    expect(link.target).toBe('_blank');
    expect(link.querySelector('img')?.getAttribute('alt')).toBe('مرفق البلاغ 1');
  });

  it('leaves the attachments block out when there are none', () => {
    expect(render([]).textContent).not.toContain('المرفقات والصور');
  });

  it('ends with the reference, the date and the status, right to left', () => {
    const facts = Array.from(render().querySelectorAll('[data-role="fact"]'));

    expect(facts.map((fact) => fact.querySelector('dt')?.textContent?.trim())).toEqual([
      'رقم البلاغ',
      'تاريخ البلاغ',
      'حالة البلاغ',
    ]);
    expect(facts[0].querySelector('dd')?.textContent?.trim()).toBe('#1023');
    expect(facts[1].querySelector('dd')?.textContent?.trim()).toBe('٩ سبتمبر ٢٠٢٦');
    expect(facts[2].querySelector('app-complaint-status-pill')?.textContent?.trim()).toBe('جديد');
  });
});
