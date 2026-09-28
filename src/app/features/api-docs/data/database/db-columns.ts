import { DbColumn } from '../../models/db-column';

export const ID: DbColumn = {
  name: 'id',
  type: 'bigint unsigned',
  key: 'pk',
  note: 'Auto increment. Sent to the API as a string.',
};

export const TIMESTAMPS: readonly DbColumn[] = [
  { name: 'created_at', type: 'timestamp', isNullable: true },
  { name: 'updated_at', type: 'timestamp', isNullable: true },
];

export const SOFT_DELETE: DbColumn = {
  name: 'deleted_at',
  type: 'timestamp',
  isNullable: true,
  note: 'Soft delete. Hidden from every list.',
};

export const ACTIVATION_STATUS_COLUMN: DbColumn = {
  name: 'status',
  type: "enum('active','suspended')",
  note: "Default 'active'.",
};

export function foreignKey(
  name: string,
  references: string,
  note = '',
  isNullable = false,
): DbColumn {
  return { name, type: 'bigint unsigned', key: 'fk', references, isNullable, note };
}

export function adminReference(name: string, note: string): DbColumn {
  return foreignKey(name, 'admins.id', note, true);
}
