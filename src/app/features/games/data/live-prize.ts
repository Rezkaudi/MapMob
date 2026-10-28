export interface LivePrize {
  readonly type: 'cash' | 'voucher';
  readonly value: number | string;
  readonly currency_code: string | null;
}
