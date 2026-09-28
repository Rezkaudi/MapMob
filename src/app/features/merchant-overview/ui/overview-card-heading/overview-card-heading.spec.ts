import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OverviewCardHeading } from './overview-card-heading';

function render(inputs: Record<string, unknown>) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(OverviewCardHeading);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('OverviewCardHeading', () => {
  it('writes the title as a section heading', () => {
    const element = render({ title: 'آخر التقييمات' });

    expect(element.querySelector('h2')!.textContent!.trim()).toBe('آخر التقييمات');
  });

  it('puts the icon tile before the title, so RTL lands it on the right', () => {
    const element = render({
      title: 'آخر التقييمات',
      icon: 'star-feather',
      iconTileClass: 'bg-accent',
    });

    const title = element.querySelector('h2')!;
    expect(title.previousElementSibling!.classList).toContain('bg-accent');
  });

  it('ends the row with "عرض الكل", so RTL puts it on the far left', () => {
    const element = render({ title: 'آخر التقييمات', viewAllRoute: '/merchant/reviews' });

    const row = element.firstElementChild!;
    const link = row.lastElementChild as HTMLAnchorElement;
    expect(link.textContent!.trim()).toBe('عرض الكل');
    expect(link.getAttribute('href')).toBe('/merchant/reviews');
  });

  it('has no link or tile unless asked', () => {
    const element = render({ title: 'الباقة' });

    expect(element.querySelector('a')).toBeNull();
    expect(element.querySelector('app-icon')).toBeNull();
  });
});
