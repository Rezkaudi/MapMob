import { TestBed } from '@angular/core/testing';
import { NEVER, of } from 'rxjs';
import { RegionRepository } from '../../data/region.repository';
import { RegionList } from './region-list';

describe('RegionList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RegionRepository,
          useValue: {
            getRegions: () =>
              of({
                items: [
                  {
                    id: 'region-1',
                    name: 'طرطوس',
                    districtCount: 5,
                    placeCount: 1200,
                    status: 'active',
                    updatedAt: '2024-01-12T00:00:00.000Z',
                  },
                ],
                totalCount: 1,
              }),
          },
        },
      ],
    });
  });

  it('renders the title and region rows', () => {
    const fixture = TestBed.createComponent(RegionList);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('المحافظات والمناطق');
    expect(text).toContain('طرطوس');
  });
});

describe('RegionList while loading', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: RegionRepository, useValue: { getRegions: () => NEVER } }],
    });
  });

  it('draws placeholder rows while the regions load', () => {
    const fixture = TestBed.createComponent(RegionList);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
  });
  it('says so when there are no regions to show', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RegionRepository,
          useValue: { getRegions: () => of({ items: [], totalCount: 0 }) },
        },
      ],
    });

    const fixture = TestBed.createComponent(RegionList);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-table-empty')).toBeTruthy();
  });
});
