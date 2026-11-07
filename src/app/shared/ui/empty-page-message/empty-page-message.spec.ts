import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EmptyPageMessage } from './empty-page-message';

describe('EmptyPageMessage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('offers a way back, even when there is nothing to add', () => {
    const fixture = TestBed.createComponent(EmptyPageMessage);
    fixture.componentRef.setInput('title', 'لا توجد اشتراكات حتى الآن');
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-back-button')).not.toBeNull();
  });

  it('says nothing is added yet, invites the first one and reports the add press', () => {
    const fixture = TestBed.createComponent(EmptyPageMessage);
    fixture.componentRef.setInput('title', 'لا توجد عروض مضافة حتى الآن');
    fixture.componentRef.setInput('description', 'أضف أول عرض إلى المنصة.');
    fixture.componentRef.setInput('addLabel', 'إضافة عرض جديد');
    fixture.detectChanges();
    const add = vi.fn();
    fixture.componentInstance.add.subscribe(add);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('لا توجد عروض مضافة حتى الآن');
    expect(element.querySelector('p')?.textContent?.trim()).toBe('أضف أول عرض إلى المنصة.');
    (element.querySelector('app-add-button button') as HTMLButtonElement).click();

    expect(add).toHaveBeenCalled();
  });

  it('draws the title alone when there is nothing to add from here', () => {
    const fixture = TestBed.createComponent(EmptyPageMessage);
    fixture.componentRef.setInput('title', 'لا توجد اشتراكات حتى الآن');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('لا توجد اشتراكات حتى الآن');
    expect(element.querySelector('p')).toBeNull();
    expect(element.querySelector('app-add-button')).toBeNull();
  });

  it('lets clicks pass to the page under it, so tabs and filters still work', () => {
    const fixture = TestBed.createComponent(EmptyPageMessage);
    fixture.componentRef.setInput('title', 'لم تصلك أي إشعارات حتى الآن');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.classList).toContain('pointer-events-none');
    expect(host.querySelector('div')?.classList).toContain('pointer-events-auto');
  });

  it('centres itself over the page unless it is asked to sit in the flow under other content', () => {
    const fixture = TestBed.createComponent(EmptyPageMessage);
    fixture.componentRef.setInput('title', 'لا توجد وسائط مضافة حتى الآن');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.className).toContain('absolute');

    fixture.componentRef.setInput('placement', 'flow');
    fixture.detectChanges();

    expect(host.className).not.toContain('absolute');
    expect(host.className).toContain('justify-center');
    expect(host.querySelector('div')?.className).not.toContain('w-[550px]');
  });
});
