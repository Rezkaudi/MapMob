import { TestBed } from '@angular/core/testing';
import { FavoritePlaceList } from './favorite-place-list';

const ROWS = [
  {
    id: 'f1',
    placeName: 'صيدلية الحياة',
    metaLabel: 'صيدليات · الرياض',
    savedLabel: 'منذ 5 أيام',
    icon: 'pills',
    tileClass: 'bg-[#006f69]',
  },
];

function render(rows: unknown[]) {
  const fixture = TestBed.createComponent(FavoritePlaceList);
  fixture.componentRef.setInput('rows', rows);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('FavoritePlaceList', () => {
  it('shows each place with its tile, meta line and when it was saved', () => {
    const item = render(ROWS).querySelector('li') as HTMLElement;

    const texts = Array.from(item.querySelectorAll('span:not(:has(*))'), (span) =>
      span.textContent?.trim(),
    ).filter(Boolean);
    expect(texts).toEqual(['صيدلية الحياة', 'صيدليات · الرياض', 'منذ 5 أيام']);
    expect(item.querySelector('.bg-\\[\\#006f69\\]')).toBeTruthy();
  });

  it('says so when nothing is saved', () => {
    expect(render([]).textContent).toContain('لا توجد أماكن مفضلة');
  });
});
