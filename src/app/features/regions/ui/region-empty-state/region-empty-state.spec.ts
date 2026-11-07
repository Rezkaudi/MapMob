import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RegionEmptyState } from './region-empty-state';

@Component({
  imports: [RegionEmptyState],
  template: `
    <app-region-empty-state title="لا توجد محافظات مضافة حتى الآن" description="أضف أول محافظة">
      <button type="button">إضافة محافظة</button>
    </app-region-empty-state>
  `,
})
class HostComponent {}

describe('RegionEmptyState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('offers a way back next to the action', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-back-button')).not.toBeNull();
  });

  it('shows the title, the description and the projected action', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h2')?.textContent?.trim()).toBe('لا توجد محافظات مضافة حتى الآن');
    expect(element.querySelector('p')?.textContent?.trim()).toBe('أضف أول محافظة');
    expect(element.querySelector('button:not(app-back-button button)')?.textContent?.trim()).toBe(
      'إضافة محافظة',
    );
  });
});
