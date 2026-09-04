import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PlaceRepository } from '../../data/place.repository';
import { PlaceList } from './place-list';

function configure(repository: Partial<PlaceRepository>) {
  TestBed.configureTestingModule({
    providers: [{ provide: PlaceRepository, useValue: repository }],
  });
}

describe('PlaceList', () => {
  it('renders the title and place rows when there are results', () => {
    configure({
      getPlaces: () =>
        of({
          items: [
            {
              id: 'place-1',
              name: 'صيدلية الحياة',
              category: 'صيدلية',
              city: 'الرياض',
              rating: 4.9,
              status: 'active',
              joinedAt: '2024-01-12T00:00:00.000Z',
            },
          ],
          totalCount: 1,
        }),
    });

    const fixture = TestBed.createComponent(PlaceList);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('الشركات والمتاجر');
    expect(text).toContain('صيدلية الحياة');
  });

  it('shows the empty state when there are no places', () => {
    configure({ getPlaces: () => of({ items: [], totalCount: 0 }) });

    const fixture = TestBed.createComponent(PlaceList);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('لا توجد أماكن مضافة حتى الآن');
  });
});
