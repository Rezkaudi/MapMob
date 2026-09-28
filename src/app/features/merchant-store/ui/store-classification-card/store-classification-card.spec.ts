import { TestBed } from '@angular/core/testing';
import { StoreClassificationCard } from './store-classification-card';

function render(
  subCategory: { id: string; name: string } | null = { id: '14', name: 'صيدليات ومراكز صحية' },
) {
  const fixture = TestBed.createComponent(StoreClassificationCard);
  fixture.componentRef.setInput('mainCategory', { id: '3', name: 'صيدليات' });
  fixture.componentRef.setInput('subCategory', subCategory);
  fixture.componentRef.setInput('supportUrl', 'mailto:support@mapmob.sy');
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('StoreClassificationCard', () => {
  it('shows the main category on the right and the sub category on the left, both locked', () => {
    const element = render();
    const boxes = [...element.querySelectorAll('[data-role="category"]')];

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('تصنيف المتجر التجاري');
    expect(boxes.map((box) => box.querySelector('p')?.textContent?.trim())).toEqual([
      'التصنيف الرئيسي',
      'التصنيف الفرعي',
    ]);
    expect(boxes.map((box) => box.lastElementChild?.textContent?.trim())).toEqual([
      'صيدليات',
      'صيدليات ومراكز صحية',
    ]);
    expect(element.querySelectorAll('app-icon[name="lock"]')).toHaveLength(2);
    expect(element.querySelector('input')).toBeNull();
  });

  it('shows a dash when there is no sub category', () => {
    const element = render(null);
    const boxes = element.querySelectorAll('[data-role="category"]');

    expect(boxes[1].lastElementChild?.textContent?.trim()).toBe('—');
  });

  it('explains the lock and links to the admins for a change', () => {
    const element = render();
    const link = element.querySelector('a') as HTMLAnchorElement;

    expect(element.textContent).toContain(
      'لا يمكن تعديل التصنيف من لوحة التاجر لطلب تعديل التصنيف تواصل مع المشرف',
    );
    expect(link.textContent?.trim()).toBe('طلب تغيير التصنيف');
    expect(link.getAttribute('href')).toBe('mailto:support@mapmob.sy');
  });
});
