import { TestBed } from '@angular/core/testing';
import { ServicesEditor } from './services-editor';

function render(services: string[]) {
  const fixture = TestBed.createComponent(ServicesEditor);
  fixture.componentRef.setInput('services', services);
  fixture.detectChanges();
  return fixture;
}

describe('ServicesEditor', () => {
  it('lists the services it was given', () => {
    const fixture = render(['توصيل', 'مواقف سيارات']);

    expect(fixture.nativeElement.textContent).toContain('توصيل');
    expect(fixture.nativeElement.textContent).toContain('مواقف سيارات');
  });

  it('adds what was typed, and ignores a duplicate', () => {
    const fixture = render(['توصيل']);
    let next: readonly string[] = [];
    fixture.componentInstance.servicesChange.subscribe((services) => (next = services));

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'خدمة 24 ساعة';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.nativeElement.querySelectorAll('button')[1].click();

    expect(next).toEqual(['توصيل', 'خدمة 24 ساعة']);
  });

  it('removes a service when its chip is dismissed', () => {
    const fixture = render(['توصيل', 'مواقف سيارات']);
    let next: readonly string[] = [];
    fixture.componentInstance.servicesChange.subscribe((services) => (next = services));

    fixture.nativeElement.querySelector('button[aria-label="إزالة توصيل"]').click();

    expect(next).toEqual(['مواقف سيارات']);
  });
});
