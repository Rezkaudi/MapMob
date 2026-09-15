import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DetailSectionCard } from './detail-section-card';

@Component({
  imports: [DetailSectionCard],
  template: `<app-detail-section-card
    heading="الأماكن المفضلة"
    icon="bookmarks"
    [actionLabel]="actionLabel"
    (action)="pressed = pressed + 1"
  >
    <p>المحتوى</p>
  </app-detail-section-card>`,
})
class HostComponent {
  actionLabel = 'عرض الكل (7)';
  pressed = 0;
}

describe('DetailSectionCard', () => {
  it('shows the heading, the content and the action', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('الأماكن المفضلة');
    expect(element.textContent).toContain('المحتوى');
    (element.querySelector('button') as HTMLButtonElement).click();
    expect(fixture.componentInstance.pressed).toBe(1);
  });

  it('leaves the action out without a label', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.actionLabel = '';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });
});
