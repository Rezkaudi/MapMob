import { TestBed } from '@angular/core/testing';
import { SectionHeading } from './section-heading';

describe('SectionHeading', () => {
  it('shows the title as a heading with its line below', () => {
    const fixture = TestBed.createComponent(SectionHeading);
    fixture.componentRef.setInput('title', 'استخدام الباقة');
    fixture.componentRef.setInput('description', 'تابع حدود استخدامك.');
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('استخدام الباقة');
    expect(element.querySelector('p')?.textContent?.trim()).toBe('تابع حدود استخدامك.');
  });
});
