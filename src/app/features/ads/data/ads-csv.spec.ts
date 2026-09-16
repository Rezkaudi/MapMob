import { buildAd } from '../testing/ad-fixture';
import { buildAdsCsvFile } from './ads-csv';

describe('buildAdsCsvFile', () => {
  it('writes a header and one row per ad, in the table order', async () => {
    const file = buildAdsCsvFile([
      buildAd(),
      buildAd({
        advertiserType: 'admin',
        placeName: null,
        contentType: 'video',
        endsOn: null,
        priority: 3,
      }),
    ]);

    const csv = (await file.text()).replace(/^﻿/, '');
    expect(csv.split('\r\n')).toEqual([
      'الإعلان,المكان,نوع المحتوى,مكان الظهور,تاريخ البدء,تاريخ الانتهاء,الأولوية,الحالة',
      'خصم 30% على جميع الأزياء الشتوية,ألبسة الفاخر,صورة,الصفحة الرئيسية,2024-01-12,2024-01-26,5,نشط',
      'خصم 30% على جميع الأزياء الشتوية,إدارة التطبيق,فيديو,الصفحة الرئيسية,2024-01-12,,3,نشط',
    ]);
  });
});
