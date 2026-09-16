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
});
