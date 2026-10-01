import {
  buildExpiredStory,
  buildStory,
  buildStoryLibrary,
} from '../testing/merchant-story-fixture';
import { describeStoryDialogNotice, describeStoryLimit, describeStoryQuota } from './story-quota';

const LIBRARY = buildStoryLibrary({
  activeStoryLimit: 5,
  items: [
    buildStory({ id: '1' }),
    buildStory({ id: '2' }),
    buildStory({ id: '3' }),
    buildExpiredStory(),
  ],
});

describe('describeStoryQuota', () => {
  it('counts only the active stories against the plan, as the usage card does', () => {
    const quota = describeStoryQuota(LIBRARY);

    expect(quota.usedCount).toBe(3);
    expect(quota.limitText).toBe('/ 5 قصص مستخدمة');
    expect(quota.usedPercent).toBe(60);
    expect(quota.remainingChipText).toBe('متبقي لك قصتان');
    expect(quota.notice).toBe('متبقي لك قصتان ضمن باقتك الحالية قبل الوصول للحد المتاح.');
  });

  it('says so when the plan has no cap', () => {
    const quota = describeStoryQuota({ ...LIBRARY, activeStoryLimit: null });

    expect(quota.limitText).toBe('/ بلا حد');
    expect(quota.notice).toBe('باقتك الحالية لا تحدّ عدد القصص النشطة.');
  });

  it('is full once the active stories reach the limit', () => {
    expect(describeStoryQuota({ ...LIBRARY, activeStoryLimit: 3 }).isFull).toBe(true);
  });
});

describe('describeStoryLimit', () => {
  it('writes the line under the count tiles', () => {
    expect(describeStoryLimit(LIBRARY)).toBe('الحد المسموح 5 قصص');
    expect(describeStoryLimit({ ...LIBRARY, activeStoryLimit: null })).toBe('الحد المسموح بلا حد');
  });
});

describe('describeStoryDialogNotice', () => {
  it('writes the grey line at the top of the add dialog', () => {
    expect(describeStoryDialogNotice(LIBRARY)).toBe(
      'متبقي لديك قصتان ضمن الباقة المجانية (الحد المسموح 5 قصص)',
    );
  });

  it('says so when the plan has no cap', () => {
    expect(describeStoryDialogNotice({ ...LIBRARY, activeStoryLimit: null })).toBe(
      'باقتك الحالية لا تحدّ عدد القصص النشطة.',
    );
  });
});
