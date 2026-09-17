import { buildAudienceEstimateLabels } from './audience-estimate-labels';

describe('buildAudienceEstimateLabels', () => {
  it('writes the device count and the share the way the banner does', () => {
    expect(buildAudienceEstimateLabels({ deviceCount: 16840, sharePercent: 68.5 })).toEqual({
      count: 'الجمهور المقدر: 16,840 جهاز نشط',
      share: 'يمثل حوالي 68.5% من إجمالي قاعدة المشتركين',
    });
  });
});
