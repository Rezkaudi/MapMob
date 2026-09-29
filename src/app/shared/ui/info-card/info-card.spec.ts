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

  it('pads 16px or 24px inside the 1px border, as Figma counts it', () => {
    const fixture = TestBed.createComponent(InfoCard);
    fixture.componentRef.setInput('heading', 'الاشتراك');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('section').classList).toContain('p-[23px]');

    fixture.componentRef.setInput('padding', 'compact');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('section').classList).toContain('p-[15px]');
  });

  function renderCard(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(InfoCard);
    fixture.componentRef.setInput('heading', 'الموقع');
    fixture.componentRef.setInput('canEdit', true);
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    return {
      section: element.querySelector('section')!,
      heading: element.querySelector('h2')!,
      editButton: element.querySelector('button')!,
    };
  }

  it('floats on the soft shadow the detail frame draws under every card', () => {
    expect(renderCard().section.classList).toContain('shadow-[0_4px_30px_0_rgba(0,0,0,0.08)]');
  });

  it('rounds 16px by default, 12px when small and 32px when large', () => {
    expect(renderCard().section.classList).toContain('rounded-2xl');
    expect(renderCard({ corner: 'small' }).section.classList).toContain('rounded-xl');
    expect(renderCard({ corner: 'large' }).section.classList).toContain('rounded-[32px]');
  });

  it('heads the card in 14px bold, or 16px on the wide cards', () => {
    expect(renderCard().heading.classList).toContain('text-[14px]/[20px]');
    expect(renderCard({ headingSize: 'large' }).heading.classList).toContain('text-[16px]/[24px]');
  });

  it('can set the heading in Cairo, as the delivery card does', () => {
    expect(renderCard().heading.classList).not.toContain('font-cairo');
    expect(renderCard({ headingFont: 'cairo' }).heading.classList).toContain('font-cairo');
  });

  it('draws the edit link at 12px with the 10px pen on its right', () => {
    const { editButton } = renderCard();

    expect(editButton.classList).toContain('text-[12px]/[20px]');
    const [icon, label] = [...editButton.children];
    expect(icon.tagName.toLowerCase()).toBe('app-icon');
    expect(label.textContent?.trim()).toBe('تعديل');
  });
});
