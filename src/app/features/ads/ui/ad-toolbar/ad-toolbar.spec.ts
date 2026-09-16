import { TestBed } from '@angular/core/testing';
import { NO_AD_FILTERS } from '../../models/ad-filters';
import { AdToolbar } from './ad-toolbar';

describe('AdToolbar', () => {
  it('searches by ad or store and opens the ad filter panel', () => {
    const fixture = TestBed.createComponent(AdToolbar);
    fixture.componentRef.setInput('filters', NO_AD_FILTERS);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('input')?.getAttribute('placeholder')).toBe(
      'ابحث باسم الإعلان أو الشركة..',
    );
    (element.querySelector('button[aria-controls="ad-filter-panel"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(element.querySelector('app-ad-filter-panel')).toBeTruthy();
  });
});
