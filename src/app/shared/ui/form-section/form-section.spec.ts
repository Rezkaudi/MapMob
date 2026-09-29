import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormSection } from './form-section';

@Component({
  imports: [FormSection],
  template: `
    <app-form-section heading="المعلومات الأساسية" icon="info">الحقول</app-form-section>
    <app-form-section heading="المعلومات الأساسية للعرض" icon="info" appearance="compact">
      الحقول
    </app-form-section>
  `,
})
class HostComponent {}

describe('FormSection', () => {
  it('renders the heading and the projected fields', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('المعلومات الأساسية');
    expect(text).toContain('الحقول');
  });

  it('draws the offer form card with 8px corners and a lighter heading', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const [place, offer] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('section'),
    );

    expect(place.className).toContain('rounded-xl');
    expect(offer.className).toContain('rounded-lg');
    expect(offer.querySelector('h2')?.className).toContain('font-medium');
  });

  it('draws the heading icon at 24px unless the section asks for another size', () => {
    const fixture = TestBed.createComponent(FormSection);
    fixture.componentRef.setInput('heading', 'موقع المكان');
    fixture.componentRef.setInput('icon', 'map-pin');
    fixture.detectChanges();
    const icon = () => fixture.nativeElement.querySelector('header app-icon span') as HTMLElement;
    expect(icon().style.width).toBe('24px');

    fixture.componentRef.setInput('iconSize', 20);
    fixture.detectChanges();
    expect(icon().style.width).toBe('20px');
  });

  it('pads its body 24px, or none when the rows run edge to edge', () => {
    const fixture = TestBed.createComponent(FormSection);
    fixture.componentRef.setInput('heading', 'منصات التوصيل');
    fixture.componentRef.setInput('icon', 'delivery');
    fixture.detectChanges();
    const body = () => fixture.nativeElement.querySelector('section > div') as HTMLElement;
    expect(body().classList).toContain('p-6');

    fixture.componentRef.setInput('hasFlushBody', true);
    fixture.detectChanges();
    expect(body().classList).not.toContain('p-6');
  });
});
