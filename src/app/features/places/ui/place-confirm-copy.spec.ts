import { buildPlaceConfirmCopy } from './place-confirm-copy';

describe('buildPlaceConfirmCopy', () => {
  it('names the place in every question', () => {
    const suspend = buildPlaceConfirmCopy('suspend', 'صيدلية الحياة');
    const remove = buildPlaceConfirmCopy('delete', 'صيدلية الحياة');

    expect(suspend.question).toContain('صيدلية الحياة');
    expect(suspend.confirmLabel).toBe('إيقاف النشاط');
    expect(remove.tone).toBe('danger');
    expect(buildPlaceConfirmCopy('activate', 'مقهى الزاوية').tone).toBe('success');
  });
});
