import { TestBed } from '@angular/core/testing';
import { PlanFeatureList } from './plan-feature-list';

function render(tone: 'plain' | 'inverse' = 'plain'): HTMLElement {
  const fixture = TestBed.createComponent(PlanFeatureList);
  fixture.componentRef.setInput('features', ['حتى 10 منتجات', 'حتى 20 صورة']);
  fixture.componentRef.setInput('tone', tone);
  fixture.detectChanges();
  return fixture.nativeElement;
}

describe('PlanFeatureList', () => {
  it('heads the list and ticks every feature, the tick first so RTL puts it on the right', () => {
    const element = render();
    const items = element.querySelectorAll('li');

    expect(element.querySelector('h3')?.textContent?.trim()).toBe('حدود الاستخدام والمزايا:');
    expect(items).toHaveLength(2);
    expect(items[0].children[0].tagName.toLowerCase()).toBe('app-icon');
    expect(items[0].textContent?.trim()).toBe('حتى 10 منتجات');
  });

  it('lightens the words on the blue card', () => {
    expect(render('inverse').querySelector('h3')?.className).toContain('text-white');
    expect(render('plain').querySelector('h3')?.className).toContain('text-text-primary');
  });
});
