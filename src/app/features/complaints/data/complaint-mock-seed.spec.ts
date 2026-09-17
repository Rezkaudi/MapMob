import { buildComplaintSeed } from './complaint-mock-seed';

const TODAY = new Date(Date.UTC(2026, 8, 17));

describe('buildComplaintSeed', () => {
  it('builds the asked number of complaints with unique ids and references', () => {
    const seed = buildComplaintSeed(TODAY, 30);

    expect(seed).toHaveLength(30);
    expect(new Set(seed.map((complaint) => complaint.id)).size).toBe(30);
    expect(new Set(seed.map((complaint) => complaint.reference)).size).toBe(30);
  });

  it('opens with the design rows: new, in review, rejected, resolved', () => {
    const seed = buildComplaintSeed(TODAY, 8);

    expect(seed.slice(0, 4).map((complaint) => complaint.status)).toEqual([
      'new',
      'inReview',
      'rejected',
      'resolved',
    ]);
    expect(seed[0].reference).toBe('#1023');
    expect(seed[0].place.name).toBe('مطعم الشام');
  });

  it('dates every report on or before today', () => {
    const seed = buildComplaintSeed(TODAY, 30);

    expect(seed.every((complaint) => complaint.reportedOn <= '2026-09-17')).toBe(true);
  });

  it('gives the same list on every call', () => {
    expect(buildComplaintSeed(TODAY, 10)).toEqual(buildComplaintSeed(TODAY, 10));
  });
});
