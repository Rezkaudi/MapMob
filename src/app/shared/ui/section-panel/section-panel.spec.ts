import { TestBed } from '@angular/core/testing';
import { SectionPanel } from './section-panel';

describe('SectionPanel', () => {
  it('shows the heading, the count badge and the subtitle', () => {
    const fixture = TestBed.createComponent(SectionPanel);
    fixture.componentRef.setInput('heading', 'العروض الترويجية');
    fixture.componentRef.setInput('badge', '3 عروض');
    fixture.componentRef.setInput('subtitle', 'العروض الترويجية الحالية');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('العروض الترويجية');
    expect(text).toContain('3 عروض');
    expect(text).toContain('العروض الترويجية الحالية');
  });

  it('hides the badge until one is given', () => {
    const fixture = TestBed.createComponent(SectionPanel);
    fixture.componentRef.setInput('heading', 'معرض الفيديوهات');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="section-badge"]')).toBeNull();
  });

  it('raises the action when its button is pressed', () => {
    const fixture = TestBed.createComponent(SectionPanel);
    fixture.componentRef.setInput('heading', 'العروض الترويجية');
    fixture.componentRef.setInput('actionLabel', 'إضافة عرض');
    fixture.detectChanges();

    let pressed = 0;
    fixture.componentInstance.action.subscribe(() => (pressed += 1));
    fixture.nativeElement.querySelector('button').click();

    expect(pressed).toBe(1);
  });
});
