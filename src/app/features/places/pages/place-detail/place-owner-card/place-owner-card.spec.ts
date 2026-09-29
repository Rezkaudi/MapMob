import { TestBed } from '@angular/core/testing';
import { PlaceOwnerCard } from './place-owner-card';

function render() {
  const fixture = TestBed.createComponent(PlaceOwnerCard);
  fixture.componentRef.setInput('owner', {
    name: 'أحمد عبدالله',
    phone: '096077789',
    extraPhone: '0933111222',
  });
  fixture.detectChanges();
  return fixture;
}

describe('PlaceOwnerCard', () => {
  it('names the owner and their phone, the phone written left to right', () => {
    const element: HTMLElement = render().nativeElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('معلومات المالك');
    expect(element.textContent).toContain('أحمد عبدالله');
    const phone = element.querySelector('[data-role="owner-phone"]');
    expect(phone?.textContent?.trim()).toBe('096077789');
    expect(phone?.getAttribute('dir')).toBe('ltr');
  });

  it('calls the owner from the outlined button', () => {
    const call = render().nativeElement.querySelector('[data-role="call-owner"]');

    expect(call.getAttribute('href')).toBe('tel:096077789');
    expect(call.textContent.trim()).toBe('الاتصال بالمالك');
  });

  it('asks to edit when "تعديل" is pressed', () => {
    const fixture = render();
    const edit = vi.fn();
    fixture.componentInstance.edit.subscribe(edit);

    fixture.nativeElement.querySelector('app-info-card button').click();

    expect(edit).toHaveBeenCalled();
  });
});
