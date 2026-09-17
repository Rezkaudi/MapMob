import { ChoiceOption } from '../../../shared/ui/choice-chips/choice-option';
import { SelectOption } from '../../../shared/ui/select-field/select-option';
import { COMPLAINT_STATUS_LABELS, ComplaintStatus } from './complaint-status';

const STATUS_ORDER: readonly ComplaintStatus[] = ['new', 'inReview', 'resolved', 'rejected'];

/** RTL renders the first chip on the right, where the design leads with "الكل". */
export const COMPLAINT_STATUS_CHOICES: readonly ChoiceOption[] = [
  { value: null, label: 'الكل' },
  ...STATUS_ORDER.map((status) => ({ value: status, label: COMPLAINT_STATUS_LABELS[status] })),
];

export const COMPLAINT_STATUS_OPTIONS: readonly SelectOption[] = STATUS_ORDER.map((status) => ({
  value: status,
  label: COMPLAINT_STATUS_LABELS[status],
}));
