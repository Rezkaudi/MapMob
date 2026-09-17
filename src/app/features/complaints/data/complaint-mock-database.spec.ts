import { buildComplaintDetail } from '../testing/complaint-fixture';
import { ComplaintMockDatabase } from './complaint-mock-database';

function createDatabase() {
  return new ComplaintMockDatabase([
    buildComplaintDetail(),
    buildComplaintDetail({ id: 'complaint-2', status: 'inReview' }),
    buildComplaintDetail({ id: 'complaint-3', status: 'resolved' }),
    buildComplaintDetail({ id: 'complaint-4', status: 'new' }),
  ]);
}

describe('ComplaintMockDatabase', () => {
  it('finds a complaint, or says it is missing', () => {
    const database = createDatabase();

    expect(database.find('complaint-2').status).toBe('inReview');
    expect(() => database.find('missing')).toThrowError('لم يتم العثور على البلاغ missing');
  });

  it('counts every status for the summary cards', () => {
    expect(createDatabase().summarize()).toEqual({
      totalCount: 4,
      newCount: 2,
      inReviewCount: 1,
      resolvedCount: 1,
      rejectedCount: 0,
    });
  });

  it('keeps a saved review', () => {
    const database = createDatabase();

    const saved = database.saveReview('complaint-1', { status: 'rejected', adminNotes: 'مكرر' });

    expect(saved.status).toBe('rejected');
    expect(database.find('complaint-1').adminNotes).toBe('مكرر');
    expect(database.summarize().rejectedCount).toBe(1);
  });

  it('removes a complaint', () => {
    const database = createDatabase();

    database.remove('complaint-2');

    expect(database.list().map((complaint) => complaint.id)).toEqual([
      'complaint-1',
      'complaint-3',
      'complaint-4',
    ]);
  });
});
