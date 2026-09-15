import { buildReview } from '../testing/review-fixture';
import { buildReviewsCsvFile } from './reviews-csv';

describe('buildReviewsCsvFile', () => {
  it('writes a header and one row per review, in the table order', async () => {
    const file = buildReviewsCsvFile([
      buildReview(),
      buildReview({ userName: 'سارة, محمد', rating: null, status: 'reported' }),
    ]);

    const csv = (await file.text()).replace(/^﻿/, '');
    expect(csv.split('\r\n')).toEqual([
      'اسم المستخدم,المكان,التقييم,نص المراجعة والتعليق,التاريخ,الحالة',
      'أحمد جمال,صيدلية الحياة,5.0,المكان ممتاز والخدمة سريعة جداً,2024-01-12,منشور',
      '"سارة, محمد",صيدلية الحياة,,المكان ممتاز والخدمة سريعة جداً,2024-01-12,مبلغ عنه',
    ]);
  });
});
