import { createPlace } from '../testing/place-fixture';
import { buildPlacesCsvFile } from './places-csv';

describe('buildPlacesCsvFile', () => {
  it('writes a header and one row per place, in the table order', async () => {
    const file = buildPlacesCsvFile([
      createPlace(),
      createPlace({
        id: 'place-2',
        code: '1025',
        name: 'مطعم, الأصالة',
        category: 'مطعم',
        city: 'جدة',
        rating: 3.6,
        status: 'suspended',
        package: 'free',
      }),
    ]);

    const csv = (await file.text()).replace(/^﻿/, '');
    expect(csv.split('\r\n')).toEqual([
      'اسم المكان,الرقم,التصنيف,الموقع,الحالة,التقييم,الباقة,تاريخ الانضمام',
      'صيدلية الحياة,1024,صيدلية,الرياض,نشط,4.9,أساسية,2024-01-12',
      '"مطعم, الأصالة",1025,مطعم,جدة,موقوف,3.6,مجانية,2024-01-12',
    ]);
  });
});
