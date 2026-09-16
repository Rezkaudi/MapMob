import { TestBed } from '@angular/core/testing';
import { EmptyPageMessage } from './empty-page-message';

describe('EmptyPageMessage', () => {
  it('says nothing is added yet, invites the first one and reports the add press', () => {
    const fixture = TestBed.createComponent(EmptyPageMessage);
    fixture.componentRef.setInput('title', 'لا توجد عروض مضافة حتى الآن');
    fixture.componentRef.setInput('description', 'أضف أول عرض إلى المنصة.');
    fixture.componentRef.setInput('addLabel', 'إضافة عرض جديد');
    fixture.detectChanges();
    const add = vi.fn();
    fixture.componentInstance.add.subscribe(add);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('لا توجد عروض مضافة حتى الآن');
    expect(element.querySelector('p')?.textContent?.trim()).toBe('أضف أول عرض إلى المنصة.');
    (element.querySelector('app-add-button button') as HTMLButtonElement).click();

    expect(add).toHaveBeenCalled();
  });
});
