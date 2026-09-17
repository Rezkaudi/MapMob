import { buildComplaintDetail } from '../testing/complaint-fixture';
import { buildComplaintDeleteCopy } from './complaint-dialog-copy';

describe('buildComplaintDeleteCopy', () => {
  it('names the complaint by its reference and warns the delete is final', () => {
    const copy = buildComplaintDeleteCopy(buildComplaintDetail());

    expect(copy.question).toBe('هل أنت متأكد من حذف البلاغ #1023؟');
    expect(copy.confirmLabel).toBe('حذف البلاغ');
    expect(copy.tone).toBe('danger');
  });
});
