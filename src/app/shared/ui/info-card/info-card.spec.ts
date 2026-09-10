import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InfoCard } from './info-card';

@Component({
  imports: [InfoCard],
  template: `<app-info-card heading="معلومات المالك" [canEdit]="true">المحتوى</app-info-card>`,
})
class HostComponent {}

describe('InfoCard', () => {
  it('renders the heading, the edit link and the projected content', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('معلومات المالك');
    expect(text).toContain('تعديل');
    expect(text).toContain('المحتوى');
  });

  it('hides the edit link unless the card allows editing', () => {
    const fixture = TestBed.createComponent(InfoCard);
    fixture.componentRef.setInput('heading', 'الاشتراك');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('pads the sidebar cards by 16px and the wide cards by 24px', () => {
    const fixture = TestBed.createComponent(InfoCard);
    fixture.componentRef.setInput('heading', 'الاشتراك');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('section').className).toContain('p-6');

    fixture.componentRef.setInput('padding', 'compact');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('section').className).toContain('p-4');
  });
});
