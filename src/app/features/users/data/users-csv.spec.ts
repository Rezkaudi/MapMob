import { buildUser } from '../testing/user-fixture';
import { buildUsersCsvFile } from './users-csv';

describe('buildUsersCsvFile', () => {
  it('writes a header and one row per user, in the table order', async () => {
    const file = buildUsersCsvFile([
      buildUser({ name: 'أحمد جمال', registeredAt: '2024-01-12T00:00:00.000Z' }),
      buildUser({
        name: 'سارة, محمود',
        email: null,
        phone: null,
        accountType: 'visitor',
        status: 'suspended',
      }),
    ]);

    const csv = (await file.text()).replace(/^\uFEFF/, '');
    expect(csv.split('\r\n')).toEqual([
      'اسم المستخدم,البريد/الهاتف,نوع الحساب,تاريخ التسجيل,آخر نشاط,الحالة',
      'أحمد جمال,ahmad@email.com,مسجل,2024-01-12,2024-01-14,نشط',
      '"سارة, محمود",,زائر,2024-01-12,2024-01-14,موقوف',
    ]);
  });
});
