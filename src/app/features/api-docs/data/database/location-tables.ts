import { DbDomain } from '../../models/db-domain';
import { ACTIVATION_STATUS_COLUMN, ID, TIMESTAMPS, foreignKey } from './db-columns';

const NAME_COLUMNS = [
  { name: 'name_ar', type: 'varchar(120)', note: 'Served as name.' },
  { name: 'name_en', type: 'varchar(120)', isNullable: true },
  { name: 'slug', type: 'varchar(140)', key: 'uq' as const, note: 'Made on the server.' },
];

export const LOCATION_DOMAIN: DbDomain = {
  id: 'db-locations',
  name: 'Locations',
  description: 'Two levels: governorate, then area.',
  layout: [['governorates'], ['areas']],
  tables: [
    {
      name: 'governorates',
      description: 'Top level of the location tree.',
      servedAs: '/governorates',
      columns: [
        ID,
        ...NAME_COLUMNS,
        ACTIVATION_STATUS_COLUMN,
        { name: 'sort_order', type: 'smallint unsigned', note: 'Default 0.' },
        ...TIMESTAMPS,
      ],
    },
    {
      name: 'areas',
      description: 'An area inside a governorate.',
      servedAs: '/governorates/{id}/areas, /areas/{id}',
      columns: [
        ID,
        foreignKey('governorate_id', 'governorates.id', 'Restrict on delete.'),
        ...NAME_COLUMNS,
        ACTIVATION_STATUS_COLUMN,
        { name: 'sort_order', type: 'smallint unsigned' },
        ...TIMESTAMPS,
      ],
      indexes: ['UNIQUE (governorate_id, name_ar)'],
    },
  ],
};
