import { buildOffer } from '../testing/offer-fixture';
import { buildOffersCsvFile } from './offers-csv';

describe('buildOffersCsvFile', () => {
  it('writes a header and one row per offer, in the table order', async () => {
    const file = buildOffersCsvFile([
      buildOffer(),
      buildOffer({ title: 'خصم, كبير', status: 'paused' }),
    ]);

    const csv = (await file.text()).replace(/^﻿/, '');
    expect(csv.split('\r\n')).toEqual([
      'العرض,المكان,التصنيف,تاريخ البدء,تاريخ الانتهاء,الحالة',
      'خصم 30% على جميع الأزياء الشتوية,ألبسة الفاخر,ألبسة,2024-01-12,2024-01-26,نشط',
      '"خصم, كبير",ألبسة الفاخر,ألبسة,2024-01-12,2024-01-26,متوقف',
    ]);
  });
});
