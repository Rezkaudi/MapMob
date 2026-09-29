import {
  buildMediaItem,
  buildMediaLibrary,
  buildMediaVideo,
} from '../testing/merchant-media-fixture';
import {
  describeMediaDialogNotice,
  describeMediaLimit,
  describeMediaQuota,
  totalMediaLimit,
} from './media-quota';

const LIBRARY = buildMediaLibrary({
  imageLimit: 4,
  videoLimit: 1,
  items: [buildMediaItem({ id: '1' }), buildMediaItem({ id: '2' }), buildMediaVideo()],
});

describe('totalMediaLimit', () => {
  it('adds the picture and video limits into the one number the page shows', () => {
    expect(totalMediaLimit(LIBRARY)).toBe(5);
  });

  it('is null when either kind has no cap', () => {
    expect(totalMediaLimit({ ...LIBRARY, videoLimit: null })).toBeNull();
  });
});

describe('describeMediaQuota', () => {
  it('writes the usage card of the frame', () => {
    const quota = describeMediaQuota(LIBRARY);

    expect(quota.usedCount).toBe(3);
    expect(quota.limitText).toBe('/ 5 وسائط مستخدمة');
    expect(quota.usedPercent).toBe(60);
    expect(quota.remainingChipText).toBe('متبقي لك وسيطان');
    expect(quota.notice).toBe('متبقي لك وسيطان ضمن باقتك الحالية قبل الوصول للحد المتاح.');
  });

  it('says so when the plan has no cap', () => {
    expect(describeMediaQuota({ ...LIBRARY, imageLimit: null }).notice).toBe(
      'باقتك الحالية لا تحدّ عدد الصور والفيديوهات.',
    );
  });
});

describe('describeMediaLimit', () => {
  it('writes the line under the count tiles', () => {
    expect(describeMediaLimit(LIBRARY)).toBe('الحد المسموح 5 وسائط');
  });

  it('says there is no cap', () => {
    expect(describeMediaLimit({ ...LIBRARY, videoLimit: null })).toBe('الحد المسموح بلا حد');
  });
});

describe('describeMediaDialogNotice', () => {
  it('writes the grey line at the top of the add dialog', () => {
    expect(describeMediaDialogNotice(LIBRARY)).toBe(
      'متبقي لديك وسيطان ضمن الباقة المجانية (الحد المسموح 5 وسائط)',
    );
  });

  it('counts past two with the plural', () => {
    const empty = { ...LIBRARY, items: [] };

    expect(describeMediaDialogNotice(empty)).toBe(
      'متبقي لديك 5 وسائط ضمن الباقة المجانية (الحد المسموح 5 وسائط)',
    );
  });

  it('says there is no cap', () => {
    expect(describeMediaDialogNotice({ ...LIBRARY, imageLimit: null })).toBe(
      'باقتك الحالية لا تحدّ عدد الصور والفيديوهات.',
    );
  });
});
